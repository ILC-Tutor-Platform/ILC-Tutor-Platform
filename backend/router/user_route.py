from fastapi import Depends, APIRouter, HTTPException, status, Request, File, UploadFile
from sqlalchemy.orm import Session
from database.config import get_db
from models import UserDetail, StudentDetail, TutorDetail, TutorAffiliation, TutorAvailability, TutorExpertise, TutorSocials, AdminDetail, SubjectDetail, TopicDetail
from constants.supabase_client import supabase
from jose import jwt, JWTError
from constants import settings
from constants.logger import logger

router = APIRouter()

SETTINGS = settings.get_settings()

JWT_SECRET = SETTINGS.SUPABASE_JWT_SECRET
JWT_ALGORITHM = "HS256"
BUCKET_NAME = 'avatar'

def require_role(allowed_roles: list[int]):
    """
    Ensures role based access to routes.
    """
    def checker(user=Depends(verify_token)):
        if not any(str(role) in user["role"] for role in allowed_roles):
            logger.error("The user's role is not allowed to access this endpoint.")
            raise HTTPException(status_code=403, detail="Permission denied")
        return user
    return checker


def get_authorization_token(request: Request):
    """
    Ensures that the authorization token exists.
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )  

    return auth_header.split(" ")[1] 

def verify_token(token: str = Depends(get_authorization_token)): 
    """
    Verify JWT token and extract user information.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], audience="authenticated")
        user_id = payload.get("sub")
        role = payload.get("user_metadata", {}).get("role", [])

        if user_id is None:
            logger.error("Token is missing user subject.")
            raise HTTPException(status_code=401, detail="Invalid token: Missing required fields.")

        return {
            "user_id": user_id,
            "role": role
        }
    
    except HTTPException:
        raise

    except JWTError as e:
        logger.error(f"Token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")

@router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    try:
        users = db.query(UserDetail).all()
        logger.info("Fetching all users from Supabase")
        return {"users": [ 
            {
                "user_id": user.userid,
                "name": user.name,
                "email": user.email,
                "date_joined": str(user.datejoined)
            } 
            for user in users 
        ]}
    except Exception as e:
        logger.error(f"Error retrieving users: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")

@router.get("/users/profile")
def get_profile(user= Depends(verify_token), db: Session = Depends(get_db)):
    try:
        uid = user["user_id"] 
        roles = user["role"]
        
        logger.info(f"Profile preview made by user {uid}")
        # Fetch user from supabase
        user_detail = db.query(UserDetail).filter(UserDetail.userid == uid).first()
        
        if not user_detail:
            logger.error(f"User detail not found for uid: {uid}")
            raise HTTPException(status_code=404, detail="User not found")
            

        # Fetch roles from Supabase
        role_ids = [int(r) for r in roles]
        logger.info(f"Role ids: {role_ids}")
        
        response = {
            "user": {

                "name": user_detail.name,
                "email": user_detail.email,
                "datejoined": str(user_detail.datejoined),
                "image_public_url": user_detail.image_public_url

            }
        }
        logger.info(f"Details: {response}")
        
        # Add student data if applicable
        if 0 in role_ids:
            student = db.query(StudentDetail).filter(StudentDetail.student_id == uid).first()
            if student:

                response["student"] = {
                    "student_number": student.student_number,
                    "degree_program": student.degree_program
                }
        
        # Add tutor data if applicable
        if 1 in role_ids:
            tutor = db.query(TutorDetail).filter(TutorDetail.tutor_id == uid).first()
            availability = db.query(TutorAvailability).filter(TutorAvailability.tutor_id == uid).all()
            affiliation = db.query(TutorAffiliation).filter(TutorAffiliation.tutor_id == uid).all()
            expertise = db.query(TutorExpertise).filter(TutorExpertise.tutor_id == uid).all()
            socials = db.query(TutorSocials).filter(TutorSocials.tutor_id == uid).all()
            subjects = db.query(SubjectDetail).filter(SubjectDetail.tutor_id == uid).all()
            
            logger.info(f"Found {len(subjects)} subjects for tutor {uid}")
            
            topic_map = {}

            if subjects:
                for subject in subjects:
                    subject_topics = (
                    db.query(TopicDetail)
                    .filter(TopicDetail.subject_id == subject.subject_id)
                    .all()
                    )
                    topic_map[subject.subject_name] = [t.topic_title for t in subject_topics]
            
            logger.info(f"Found {len(topic_map)} topics for tutor {uid}")
            

            if tutor:
                response["tutor"] = {
                    "description": tutor.description,
                    "status": tutor.status,
                    "affiliations": [a.affiliations for a in affiliation] if affiliation else [],
                    "expertise": [e.expertise for e in expertise] if expertise else [],
                    "socials": [s.socials for s in socials] if socials else [],
                    "availability": [a.availability for a in availability] if availability else [],
                    "subjects": [s.subject_name for s in subjects] if subjects else [],
                    "topics": topic_map 
                }
            else:
                logger.warning(f"Tutor detail not found for uid: {uid}")
                response["tutor"] = {
                    "description": None,
                    "status": None,
                    "affiliations": [],
                    "expertise": [],
                    "socials": [],
                    "availability": [],
                    "subjects": [],
                    "topics": []
                }
        
        # Add admin data if applicable
        if 2 in role_ids:
            admin = db.query(AdminDetail).filter(AdminDetail.admin_id == uid).first()
            if admin:
                response["admin"] = {
                    "admin_role": admin.admin_role
                }

        
        return response
        

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_profile for user {uid if 'uid' in locals() else 'unknown'}: {str(e)}")
        logger.error(f"Exception type: {type(e).__name__}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Helper function to sync topics for a subject
def sync_topics_for_subject(subject_id: str, updated_topics: list):
    """
    Synchronizes topics for a given subject by adding new topics and 
    removing unused ones (only if they're not referenced in sessions).
    """
    try:
        # Get existing topics for this subject
        existing_res = supabase.table("topic_detail")\
            .select("topic_id, topic_title")\
            .eq("subject_id", subject_id)\
            .execute()
        existing_topics = existing_res.data or []

        existing_titles = [t["topic_title"] for t in existing_topics]
        existing_title_to_id = {t["topic_title"]: t["topic_id"] for t in existing_topics}

        # Clean and filter updated topics
        updated_titles = [name.strip() for name in updated_topics if name and name.strip()]


        # Determine what to add and what to potentially delete
        to_add = list(set(updated_titles) - set(existing_titles))
        to_delete = list(set(existing_titles) - set(updated_titles))

        topics_deleted = 0
        topics_skipped = 0
        topics_added = 0

        # Delete topics not in updated list (only if unused)
        for title in to_delete:

            topic_id = existing_title_to_id.get(title)
            if topic_id:
                try:
                    # Check if topic is referenced in sessions
                    session_check = supabase.table("session")\
                        .select("session_id")\
                        .eq("topic_id", topic_id)\
                        .limit(1)\
                        .execute()
                    
                    if session_check.data:
                        logger.warning(f"Cannot delete topic '{title}' - it's being used in sessions")
                        topics_skipped += 1
                    else:
                        # Safe to delete
                        supabase.table("topic_detail").delete().eq("topic_id", topic_id).execute()
                        topics_deleted += 1
                        logger.info(f"Deleted topic: {title}")
                except Exception as e:
                    logger.error(f"Error checking/deleting topic '{title}': {str(e)}")
                    topics_skipped += 1


        # Add new topics
        for title in to_add:
            try:
                supabase.table("topic_detail").insert({
                    "subject_id": subject_id, 
                    "topic_title": title

                }).execute()
                topics_added += 1
                logger.info(f"Added topic: {title} to subject_id: {subject_id}")
            except Exception as e:

                logger.error(f"Error adding topic '{title}': {str(e)}")

        # Return summary for logging
        return {
            "added": topics_added,
            "deleted": topics_deleted,
            "skipped": topics_skipped

        }


    except Exception as e:
        logger.error(f"Error syncing topics for subject_id {subject_id}: {str(e)}")
        raise


@router.patch("/users/profile/update")
def update_user_profile(
    data: dict, 
    user=Depends(verify_token), 

):
    uid = user["user_id"]
    role = user["role"]
    
    try:
        logger.info(f"Updating user {uid}")
        
        # Check if user exists

        if not user:

            logger.error("User not found in database.")
            raise HTTPException(status_code=404, detail="User not found.")
        
        # User table updates
        if "user" in data:
            user_fields = {
                "name": data["user"].get("name"),
                "email": data["user"].get("email")
            }
            user_fields = {k: v for k, v in user_fields.items() if v is not None}
            if user_fields:
                supabase.table("user_detail").update(user_fields).eq("userid", uid).execute()

        # Student table updates

        if "student" in data:
            logger.info("Updating student info...")
            if "0" in role:
                student_fields = {
                    "student_number": data["student"].get("student_number"),
                    "degree_program": data["student"].get("degree_program")
                }
                student_fields = {k: v for k, v in student_fields.items() if v is not None}
                if student_fields:
                    supabase.table("student_detail").update(student_fields).eq("student_id", uid).execute()

            else:
                logger.error("Only students can update student fields.")
                raise HTTPException(status_code=403, detail="Permission denied.")

        # Tutor table updates
        if "tutor" in data:
            if "1" in role:
                tutor_fields = {
                    "description": data["tutor"].get("description")
                }
                tutor_fields = {k: v for k, v in tutor_fields.items() if v is not None}
                
                if tutor_fields:
                    supabase.table("tutor_detail").update(tutor_fields).eq("tutor_id", uid).execute()
            else:
                logger.error("Only tutors can update tutor fields.")
                raise HTTPException(status_code=403, detail="Permission denied")

        # Admin table updates
        if "admin" in data:
            if "2" in role:
                admin_fields = {

                    "admin_role": data["admin"].get("admin_role")
                }
                admin_fields = {k: v for k, v in admin_fields.items() if v is not None}
                
                if admin_fields:
                    supabase.table("admin_detail").update(admin_fields).eq("admin_id", uid).execute()
            else:
                logger.error("Only an admin can update admin fields.")

                raise HTTPException(status_code=403, detail="Permission denied")
        
        if "subject" in data:
            if "1" in role:
                subject_names = data["subject"].get("subject_name", [])

                # Get all current subjects for this tutor

                existing_subjects = supabase.table("subject_detail")\
                    .select("subject_id, subject_name")\
                    .eq("tutor_id", uid)\
                    .execute()

                existing_names = [s["subject_name"] for s in existing_subjects.data or []]

                new_names = [name.strip() for name in subject_names if name and name.strip()]

                to_add = [name for name in new_names if name not in existing_names]
                to_remove = [s for s in existing_subjects.data or [] if s["subject_name"] not in new_names]

                # Add any new subjects
                for name in to_add:
                    supabase.table("subject_detail").insert({
                        "tutor_id": uid,
                        "subject_name": name
                    }).execute()

        class FakeResponse:
            def __init__(self, data):
                self.data = data

        # Attempt to remove unused subjects
        for subject in to_remove:
            subject_id = subject["subject_id"]

            try:
                # Step 1: Get topics under this subject
                topics = supabase.table("topic_detail")\
                    .select("topic_id")\
                    .eq("subject_id", subject_id)\
                    .execute()


                topic_ids = [t["topic_id"] for t in topics.data or []]

                # Step 2: Check if any sessions exist for these topics
                if topic_ids:
                    active_sessions_check = supabase.table("session")\
                        .select("session_id")\
                        .in_("topic_id", topic_ids)\
                        .in_("status", [0, 1, 2])\
                        .execute()
                else:
                    active_sessions_check = FakeResponse([])

                # Step 3: If no active sessions, delete topics and subject
                if not active_sessions_check.data:
                    # Delete all topics first
                    if topic_ids:
                        supabase.table("topic_detail")\
                            .delete()\
                            .in_("topic_id", topic_ids)\
                            .execute()
                        logger.info(f"Deleted all topics for subject: {subject['subject_name']}")

                    # Then delete subject
                    supabase.table("subject_detail")\
                        .delete()\
                        .eq("subject_id", subject_id)\
                        .execute()
                    logger.info(f"Deleted subject: {subject['subject_name']}")
                else:
                    logger.warning(
                        f"Cannot delete subject '{subject['subject_name']}' - it has {len(active_sessions_check.data)} active sessions"
                    )


            except Exception as e:
                logger.error(f"Error checking/deleting subject {subject['subject_name']}: {str(e)}")



        # Expertise updates

        if "expertise" in data:
            if "1" in role:
                expertise_list = data["expertise"].get("expertise", [])
                # Delete existing expertise
                supabase.table("tutor_expertise").delete().eq("tutor_id", uid).execute()

                # Insert new expertise
                for topic in expertise_list:
                    if topic and topic.strip():
                        supabase.table("tutor_expertise").insert({
                            "tutor_id": uid,
                            "expertise": topic.strip()
                        }).execute()
            else:
                logger.error("Only tutors can update expertise.")
                raise HTTPException(status_code=403, detail="Permission denied") 

        # Availability updates
        if "availability" in data:
            if "1" in role:
                availability_data = data["availability"]
                dates = availability_data.get("availability", [])
                time_from = availability_data.get("available_time_from", [])
                time_to = availability_data.get("available_time_to", [])

                # Delete existing availability entries
                supabase.table("tutor_availability").delete().eq("tutor_id", uid).execute()


                # Insert new availability entries
                min_length = min(len(dates), len(time_from), len(time_to))
                for i in range(min_length):
                    if dates[i] and time_from[i] and time_to[i]:
                        supabase.table("tutor_availability").insert({
                            "tutor_id": uid,
                            "availability": dates[i],
                            "available_time_from": time_from[i],
                            "available_time_to": time_to[i]
                        }).execute()
            else:
                logger.error("Only tutors can update tutor availability.")
                raise HTTPException(status_code=403, detail="Permission denied")    

        # Affiliation updates
        if "affiliation" in data:
            if "1" in role:
                affiliation_list = data["affiliation"].get("affiliation", [])
                # Delete existing affiliations
                supabase.table("tutor_affiliation").delete().eq("tutor_id", uid).execute()
                # Insert new affiliations
                for affiliation in affiliation_list:

                    if affiliation and affiliation.strip():
                        supabase.table("tutor_affiliation").insert({
                            "tutor_id": uid,
                            "affiliations": affiliation.strip()
                        }).execute()
            else:
                logger.error("Only tutors can update tutor affiliation.")
                raise HTTPException(status_code=403, detail="Permission denied")    

        # Socials updates
        if "socials" in data:

            if "1" in role:
                socials_list = data["socials"].get("socials", [])
                # Delete existing socials
                supabase.table("tutor_socials").delete().eq("tutor_id", uid).execute()
                # Insert new socials
                for link in socials_list:
                    if link and link.strip():
                        supabase.table("tutor_socials").insert({
                            "tutor_id": uid,
                            "socials": link.strip()
                        }).execute()
            else:
                logger.error("Only tutors can update tutor socials.")
                raise HTTPException(status_code=403, detail="Permission denied")        

        # Topic updates using the helper function
        if "topic" in data:
            if "1" in role:  # Tutor check
                subject_topic_map = data["topic"]
                logger.info(f"Updating topics for tutor {uid}: {subject_topic_map}")


                # Validate that subject_topic_map is a dictionary

                if not isinstance(subject_topic_map, dict):
                    logger.error("Topic data must be a dictionary mapping subjects to topic lists")
                    raise HTTPException(status_code=400, detail="Invalid topic data format. Expected a dictionary mapping subjects to topic lists.")

                total_added = 0
                total_deleted = 0
                total_skipped = 0

                for subject_name, topic_list in subject_topic_map.items():
                    logger.info(f"Processing subject: {subject_name} with topics: {topic_list}")

                    
                    # Validate topic_list is a list

                    if not isinstance(topic_list, list):
                        logger.error(f"Topics for subject '{subject_name}' must be a list")
                        raise HTTPException(status_code=400, detail=f"Topics for subject '{subject_name}' must be a list")


                    # Find subject_id where tutor owns the subject
                    subject_res = supabase.table("subject_detail")\
                        .select("subject_id")\
                        .eq("subject_name", subject_name)\
                        .eq("tutor_id", uid)\
                        .execute()

                    if not subject_res.data:
                        logger.warning(f"Subject '{subject_name}' not found or not owned by tutor {uid}")
                        raise HTTPException(
                            status_code=400, 
                            detail=f"Subject '{subject_name}' not found or not owned by you. Please ensure the subject exists in your profile first."
                        )


                    subject_id = subject_res.data[0]["subject_id"]
                    logger.info(f"Found subject_id: {subject_id} for subject: {subject_name}")

                    # Use the helper function to sync topics

                    try:
                        result = sync_topics_for_subject(subject_id, topic_list)
                        total_added += result["added"]
                        total_deleted += result["deleted"]
                        total_skipped += result["skipped"]
                        

                        logger.info(f"Updated topics for subject '{subject_name}' - Added: {result['added']}, Deleted: {result['deleted']}, Skipped: {result['skipped']}")
                        
                    except Exception as e:
                        logger.error(f"Error updating topics for subject '{subject_name}': {str(e)}")

                        raise HTTPException(
                            status_code=500, 
                            detail=f"Failed to update topics for subject '{subject_name}'"
                        )

                # Log overall results
                logger.info(f"Topic update completed for tutor {uid} - Total added: {total_added}, deleted: {total_deleted}, skipped: {total_skipped}")
                
                # Warn user if some topics couldn't be deleted
                if total_skipped > 0:
                    logger.warning(f"{total_skipped} topics could not be removed because they are being used in active sessions")


            else:
                logger.error("Only tutors can update topics.")
                raise HTTPException(status_code=403, detail="Permission denied")

        return {"message": "Profile updated successfully."}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User detail cannot be updated. Error: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Profile update failed.")

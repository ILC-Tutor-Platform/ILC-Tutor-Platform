from fastapi import Depends, APIRouter, HTTPException, status, Request, File, UploadFile
from sqlalchemy.orm import Session
from database.config import get_db
from models import UserDetail, StudentDetail, TutorDetail, TutorAffiliation, TutorAvailability, TutorExpertise, TutorSocials, AdminDetail, SubjectDetail
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
            
            # Get all topics for subjects owned by this tutor
            topics = []
            if subjects:  # Only query topics if there are subjects
                topics = db.query(TopicDetail).join(
                    SubjectDetail, TopicDetail.subject_id == SubjectDetail.subject_id
                ).filter(SubjectDetail.tutor_id == uid).all()
            
            logger.info(f"Found {len(topics)} topics for tutor {uid}")
            

            if tutor:
                response["tutor"] = {
                    "description": tutor.description,
                    "status": tutor.status,
                    "affiliations": [a.affiliations for a in affiliation] if affiliation else [],
                    "expertise": [e.expertise for e in expertise] if expertise else [],
                    "socials": [s.socials for s in socials] if socials else [],
                    "availability": [a.availability for a in availability] if availability else [],
                    "subjects": [s.subject_name for s in subjects] if subjects else [],

                    "topics": [t.topic_title for t in topics] if topics else []
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

@router.patch("/users/profile/update")
def update_user_profile(
    data: dict, 
    user=Depends(verify_token), 
    ):

    uid = user["user_id"]
    role = user["role"]
    try:
        logger.info(f"Updating user {uid}")
        # Check if user exists in Supabase Auth
        if not user:
            logger.error("User not found in database.")
            raise HTTPException(status_code=404, detail="User not found.")
        
        # User table
        if "user" in data:
            user_fields = {
                "name": data["user"].get("name"),
                "email": data["user"].get("email")
            }
            user_fields = {k: v for k, v in user_fields.items() if v is not None}
            if user_fields:
                supabase.table("user_detail").update(user_fields).eq("userid", uid).execute()

        # Student table
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

        # Tutor table
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

        # Admin table
        if "admin" in data:
            if "2" in role:
                admin_fields = {
                    "admin_role": data["admin"].get("admin_role")
                }
                
                if admin_fields:
                    supabase.table("admin_detail").update(admin_fields).eq("admin_id", uid).execute()
            else:
                logger.error("Only an admin can update admin fields.")
                raise HTTPException(status_code=403, detail="Permission denied")
        
        if "subject" in data:
            if "1" in role:
                subject_name = data["subject"].get("subject_name", [])
                supabase.table("subject_detail").delete().eq("tutor_id", uid).execute()
                for name in subject_name:
                    supabase.table("subject_detail").insert({
                        "tutor_id": uid,
                        "subject_name": name
                    }).execute()
            else:
                logger.error("Only tutors can update subjects.")
                raise HTTPException(status_code=403, detail="Permission denied")
        
        if "expertise" in data:
            if "1" in role:
                expertise_list = data["expertise"].get("expertise", [])
                supabase.table("tutor_expertise").delete().eq("tutor_id", uid).execute()
                for topic in expertise_list:
                    supabase.table("tutor_expertise").insert({
                        "tutor_id": uid,
                        "expertise": topic
                    }).execute()
            else:
                logger.error("Only tutors can update expertise.")
                raise HTTPException(status_code=403, detail="Permission denied") 

        if "availability" in data:
            if "1" in role:
                availability_list = data["availability"]
                dates = availability_list.get("availability", [])
                time_from = availability_list.get("available_time_from", [])
                time_to = availability_list.get("available_time_to", [])

                # Delete existing availability entries
                supabase.table("tutor_availability").delete().eq("tutor_id", uid).execute()

                # Insert new availability entries
                for i in range(len(dates)):
                    if i < len(time_from) and i < len(time_to):
                        supabase.table("tutor_availability").insert({
                            "tutor_id": uid,
                            "availability": dates[i],
                            "available_time_from": time_from[i],
                            "available_time_to": time_to[i]
                        }).execute()
            else:
                logger.error("Only tutors can update tutor availability.")
                raise HTTPException(status_code=403, detail="Permission denied")    


        if "affiliation" in data:
            if "1" in role:
                affiliation_list = data["affiliation"].get("affiliation", [])
                supabase.table("tutor_affiliation").delete().eq("tutor_id", uid).execute()
                for affiliation in affiliation_list:
                    supabase.table("tutor_affiliation").insert({
                        "tutor_id": uid,
                        "affiliations": affiliation
                    }).execute()
            else:
                logger.error("Only tutors can update tutor affiliation.")
                raise HTTPException(status_code=403, detail="Permission denied")    

        if "socials" in data:
            if "1" in role:
                # Get socials from the metadata 
                socials_list = data["socials"].get("socials", [])
                
                # Get socials from the database, if it exists
                supabase.table("tutor_socials").delete().eq("tutor_id", uid).execute()
                for link in socials_list:
                    supabase.table("tutor_socials").insert({
                        "tutor_id": uid,
                        "socials": link
                    }).execute()
            else:
                logger.error("Only tutors can update tutor socials.")
                raise HTTPException(status_code=403, detail="Permission denied")        

        # Enhanced topic update functionality
        if "topic" in data:
            if "1" in role:  # Tutor check
                subject_topic_map = data["topic"]
                logger.info(f"Updating topics for tutor {uid}: {subject_topic_map}")

                # Validate that subject_topic_map is a dictionary
                if not isinstance(subject_topic_map, dict):
                    logger.error("Topic data must be a dictionary mapping subjects to topic lists")
                    raise HTTPException(status_code=400, detail="Invalid topic data format")

                for subject_name, topic_list in subject_topic_map.items():
                    logger.info(f"Processing subject: {subject_name} with topics: {topic_list}")
                    
                    # Validate topic_list is a list
                    if not isinstance(topic_list, list):
                        logger.error(f"Topics for subject '{subject_name}' must be a list")
                        raise HTTPException(status_code=400, detail=f"Topics for subject '{subject_name}' must be a list")

                    # 1. Find subject_id where tutor owns the subject
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


                    # 2. Check if topics currently exist for this subject
                    existing_topics_res = supabase.table("topic_detail")\
                        .select("topic_id, topic_title")\
                        .eq("subject_id", subject_id)\
                        .execute()

                    
                    existing_topics_count = len(existing_topics_res.data) if existing_topics_res.data else 0
                    logger.info(f"Found {existing_topics_count} existing topics for subject {subject_name}")

                    # 3. Smart topic update - only modify what's needed
                    existing_topic_titles = [topic["topic_title"] for topic in existing_topics_res.data] if existing_topics_res.data else []
                    new_topic_titles = [name.strip() for name in topic_list if name and name.strip()]
                    
                    # Find topics to delete (exist in DB but not in new list)
                    topics_to_delete = [topic for topic in existing_topics_res.data or [] 
                                      if topic["topic_title"] not in new_topic_titles]
                    
                    # Find topics to add (in new list but not in DB)
                    topics_to_add = [name for name in new_topic_titles 
                                   if name not in existing_topic_titles]
                    
                    logger.info(f"Topics to delete: {[t['topic_title'] for t in topics_to_delete]}")
                    logger.info(f"Topics to add: {topics_to_add}")
                    
                    # Delete only unused topics
                    topics_deleted = 0
                    topics_skipped = 0
                    

                    for topic in topics_to_delete:

                        try:
                            # Check if topic is referenced in sessions
                            session_check = supabase.table("session")\
                                .select("session_id")\
                                .eq("topic_id", topic["topic_id"])\
                                .execute()
                            
                            if session_check.data:
                                logger.warning(f"Cannot delete topic '{topic['topic_title']}' - it's being used in {len(session_check.data)} session(s)")
                                topics_skipped += 1
                            else:
                                # Safe to delete
                                supabase.table("topic_detail").delete().eq("topic_id", topic["topic_id"]).execute()
                                topics_deleted += 1
                                logger.info(f"Deleted topic: {topic['topic_title']}")
                                

                        except Exception as e:
                            logger.error(f"Error processing topic '{topic['topic_title']}': {str(e)}")

                            topics_skipped += 1
                    
                    # Add new topics
                    topics_added = 0
                    for topic_title in topics_to_add:
                        try:
                            supabase.table("topic_detail").insert({
                                "subject_id": subject_id,
                                "topic_title": topic_title
                            }).execute()
                            topics_added += 1
                            logger.info(f"Added topic: {topic_title} to subject: {subject_name}")
                        except Exception as e:
                            logger.error(f"Error adding topic '{topic_title}': {str(e)}")
                    

                    # Log results
                    if existing_topics_count == 0 and topics_added > 0:
                        logger.info(f"Created {topics_added} new topics for subject: {subject_name}")
                    else:
                        logger.info(f"Updated topics for subject: {subject_name} - Added: {topics_added}, Deleted: {topics_deleted}, Skipped (in use): {topics_skipped}")
                    
                    # Warn user if some topics couldn't be deleted
                    if topics_skipped > 0:
                        logger.warning(f"{topics_skipped} topics could not be removed from '{subject_name}' because they are being used in active sessions")

                logger.info(f"Successfully processed topics for tutor {uid}")
                

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
        raise HTTPException(status_code=500, detail="Update user failed.")

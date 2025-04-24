from fastapi import Depends, APIRouter, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
from models import UserDetail, StudentDetail, TutorDetail, UserRoleDetail, TutorAffiliation, TutorAvailability, TutorExpertise, TutorSocials
from supabase_client import supabase
from jose import jwt, JWTError
import os

router = APIRouter()

JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
JWT_ALGORITHM = "HS256"

# Role-based access function
def require_role(allowed_roles: list[str]):
    def checker(user=Depends(verify_token)):
        if not any(str(role) in user["role"] for role in allowed_roles):
            raise HTTPException(status_code=403, detail="Permission denied: The user's role is not allowed to access this endpoint.")
        return user
    return checker

def get_authorization_token(request: Request):
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )  

    return auth_header.split(" ")[1] 

def verify_token(token: str = Depends(get_authorization_token)): 
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], audience="authenticated")
        user_id = payload.get("sub")
        role = payload.get("user_metadata", {}).get("role", [])

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: no subject")
        
        return {
            "user_id": user_id,
            "role": role
        }
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")

@router.get("/users/profile")
def get_profile(user= Depends(verify_token), db: Session = Depends(get_db)):
    try:
        uid = user["user_id"] 
        roles = user["role"]

        # Fetch user from supabase
        user_detail = db.query(UserDetail).filter(UserDetail.userid == uid).first()
        if not user_detail:
            raise HTTPException(status_code=404, detail="User not found in database.")

        # Fetch user from Supabase
        all_users = supabase.auth.admin.list_users()
        user = next((u for u in all_users if u.id == uid), None)
        if not user:
            raise HTTPException(status_code=404, detail="User not found in database.")

        role_ids = [int(r) for r in roles]

        response = {
            "user": {
                "name": user_detail.name,
                "email": user_detail.email,
                "datejoined": str(user_detail.datejoined)
            }
        }

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

            if tutor:
                response["tutor"] = {
                    "description": tutor.description,
                    "status": tutor.status,
                    "affiliations": [a.affiliations for a in affiliation],
                    "expertise": [e.expertise for e in expertise],
                    "socials": [s.socials for s in socials],
                    "availability": [a.availability for a in availability]
                }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/users/profile/update")
def update_user_profile(
    data: dict, 
    user=Depends(verify_token), 
    ):

    uid = user["user_id"]
    role = user["role"]

    try:
        # Check if user exists in Supabase Auth
        all_users = supabase.auth.admin.list_users()
        user = next((u for u in all_users if u.id == uid), None)

        if not user:
            raise HTTPException(status_code=404, detail="User not found in database.")

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
            if "0" in role:
                student_fields = {
                    "student_number": data["student"].get("student_number"),
                    "degree_program": data["student"].get("degree_program")
                }
                student_fields = {k: v for k, v in student_fields.items() if v is not None}
                if student_fields:
                    supabase.table("student_detail").update(student_fields).eq("student_id", uid).execute()
            else:
                raise HTTPException(status_code=403, detail="Only students can update student fields.")

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
                raise HTTPException(status_code=403, detail="Only tutors can update tutor fields.")
        
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
                raise HTTPException(status_code=403, detail="Only tutors can update tutor fields.")
        
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
                raise HTTPException(status_code=403, detail="Only tutors can update tutor fields.")    

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
                raise HTTPException(status_code=403, detail="Only tutors can update tutor fields.")    


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
                raise HTTPException(status_code=403, detail="Only tutors can update tutor fields.")    

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
                raise HTTPException(status_code=403, detail="Only tutors can update tutor fields.")    

        return {"message": "Profile updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Update user failed.")
    
# Delete user data from table
@router.delete("/user/{userid}")
def delete_user(userid: str, db: Session = Depends(get_db)):
    try:
        user = db.query(UserDetail).filter(UserDetail.userid == userid).first()
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

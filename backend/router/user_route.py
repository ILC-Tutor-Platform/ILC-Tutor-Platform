from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UserDetail, StudentDetail, TutorDetail, UserRoleDetail, TutorAffiliation, TutorAvailability, TutorExpertise, TutorSocials
from schema import UserDetailSchema
from supabase_client import supabase
from pydantic import BaseModel
router = APIRouter()

# Display all data from the user_detail table
@router.get("/")
def get_details():
    response = supabase.table("user_detail").select("*").execute()
    return response.data

# --------------- USER PROFILE -------------------
# class UserProfile(BaseModel):
#     user_metadata: dict

@router.get("/users/profile")
def get_profile(uid: str, db: Session = Depends(get_db)):
    try:
        # Fetch user from your local DB
        user_detail = db.query(UserDetail).filter(UserDetail.userid == uid).first()
        if not user_detail:
            raise HTTPException(status_code=404, detail="User not found in UserDetail")

        # Fetch user from Supabase
        all_users = supabase.auth.admin.list_users()
        user = next((u for u in all_users if u.id == uid), None)
        if not user:
            raise HTTPException(status_code=404, detail="User not found in Supabase")

        roles = db.query(UserRoleDetail.role_id).filter(UserRoleDetail.user_id == uid).all()
        role_ids = [r[0] for r in roles] 

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

# Add user data to table
# @router.post("/user", response_model=UserDetailSchema)
# def create_user(user: UserDetailSchema, db: Session = Depends(get_db)):
#     try:
#         db_user = UserDetail(**user.model_dump())
#         db.add(db_user)
#         db.commit()
#         db.refresh(db_user)
#         return db_user
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

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
    
# Update user data in table
# @router.patch("/users/update", response_model=UserDetailSchema)
# def update_user(userid: str, user: UserDetailSchema, db: Session = Depends(get_db)):
#     try:
#         db_user = db.query(UserDetail).filter(UserDetail.userid == userid).first()
#         db_user.name = user.name
#         db_user.email = user.email
#         db_user.role = user.role
#         db_user.datejoined = user.datejoined
#         db.commit()
#         db.refresh(db_user)
#         return db_user
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
    
@router.patch("/users/profile/update")
def update_user_profile(uid: str, data: dict):
    try:
        # Check if user exists in Supabase Auth
        all_users = supabase.auth.admin.list_users()
        user = next((u for u in all_users if u.id == uid), None)
        if not user:
            raise HTTPException(status_code=404, detail="User not found in Supabase")

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
            student_fields = {
                "student_number": data["student"].get("student_number"),
                "degree_program": data["student"].get("degree_program")
            }
            student_fields = {k: v for k, v in student_fields.items() if v is not None}
            if student_fields:
                supabase.table("student_detail").update(student_fields).eq("student_id", uid).execute()

        # Tutor table
        if "tutor" in data:
            tutor_fields = {
                "description": data["tutor"].get("description")
            }
            tutor_fields = {k: v for k, v in tutor_fields.items() if v is not None}
            
            if tutor_fields:
                supabase.table("tutor_detail").update(tutor_fields).eq("tutor_id", uid).execute()

        return {"message": "Profile updated successfully."}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

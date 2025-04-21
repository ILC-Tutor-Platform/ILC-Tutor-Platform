from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UserDetail
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
class UserProfile(BaseModel):
    user_metadata: dict

@router.get("/users/profile")
def get_profile(uid: str):
    # Get all users from supabase
    users = supabase.auth.admin.list_users()
        
    # Find user by email
    user = next((u for u in users if u.id == uid), None)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Returns metadata
    return {
        "user_metadata": user.app_metadata
    }

# Add user data to table
@router.post("/user", response_model=UserDetailSchema)
def create_user(user: UserDetailSchema, db: Session = Depends(get_db)):
    try:
        db_user = UserDetail(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
@router.patch("/user/{userid}", response_model=UserDetailSchema)
def update_user(userid: str, user: UserDetailSchema, db: Session = Depends(get_db)):
    try:
        db_user = db.query(UserDetail).filter(UserDetail.userid == userid).first()
        db_user.name = user.name
        db_user.email = user.email
        db_user.role = user.role
        db_user.datejoined = user.datejoined
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
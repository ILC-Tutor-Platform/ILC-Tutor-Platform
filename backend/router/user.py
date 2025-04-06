from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from database import get_db
from models import UserDetail
from schema import UserDetailSchema
from supabase_client import supabase

router = APIRouter()

# Dependency to get a session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db  # Provide session to request
#     finally:
#         db.close()  # Ensure session is closed after request

# Display all data from the user_detail table
@router.get("/")
def get_details(db: Session = Depends(get_db)):
    response = supabase.table("user_detail").select("*").execute()
    return response.data

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
        return {"error": str(e)}

# Delete user data from table
@router.delete("/user/{userid}")
def delete_user(userid: int, db: Session = Depends(get_db)):
    try:
        user = db.query(UserDetail).filter(UserDetail.userid == userid).first()
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        return {"error": str(e)}
    
# Update user data in table
@router.put("/user/{userid}", response_model=UserDetailSchema)
def update_user(userid: int, user: UserDetailSchema, db: Session = Depends(get_db)):
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
        return {"error": str(e)}
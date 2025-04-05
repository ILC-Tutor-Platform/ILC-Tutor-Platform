# This file contains the FastAPI code to interact with the database and Supabase

from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import UserDetail
from schema import UserDetailSchema
from supabase_client import supabase, create_client
from fastapi.encoders import jsonable_encoder
from datetime import date
import os
from dotenv import load_dotenv

app = FastAPI()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Dependency to get a session
def get_db():
    db = SessionLocal()
    try:
        yield db  # Provide session to request
    finally:
        db.close()  # Ensure session is closed after request

# Display all data from the user_detail table
@app.get("/")
def get_details(db: Session = Depends(get_db)):
    response = supabase.table("user_detail").select("*").execute()
    return response.data

# Add user data to table
@app.post("/user", response_model=UserDetailSchema)
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
@app.delete("/user/{userid}")
def delete_user(userid: int, db: Session = Depends(get_db)):
    try:
        user = db.query(UserDetail).filter(UserDetail.userid == userid).first()
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        return {"error": str(e)}
    
# Update user data in table
@app.put("/user/{userid}", response_model=UserDetailSchema)
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
    
# Verifies a user’s email after signup.
@app.post("/auth/verify-email")
def verify_email(email: str, db: Session = Depends(get_db)):
    try:
        # Get all users
        users = supabase.auth.admin.list_users()

        # Find user by email
        user = next((u for u in users if u.email == email), None)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Log the values being used for insertion
        print(f"Inserting user with userid: {user.id}, email: {email}, datejoined: {user.created_at.date()}")

        # Check if user is already verified
        if user.email_confirmed_at:
            # Check if user already exists in user_detail table
            existing_user_detail = db.query(UserDetail).filter(UserDetail.userid == user.id).first()

            if existing_user_detail:
                # If user already exists, return a message
                return {"message": "User profile already exists", "email": user.email}

            # If user does not exist, insert the new record
            new_user_detail = UserDetail(
                userid=user.id,  # Use 'userid' column
                email=email,
                datejoined=user.created_at.date(),  # Assuming user.created_at is a datetime object
                role="user",  # Default role
                name=None  # Adjust based on your needs
            )

            db.add(new_user_detail)
            db.commit()
            db.refresh(new_user_detail)
            return {"message": "Email successfully verified", "email": user.email}
        else:
            return {"message": "Email not yet verified", "email": user.email}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


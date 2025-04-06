from fastapi import APIRouter, HTTPException, Depends
from database import get_db
from sqlalchemy.orm import Session
from models import UserDetail
from supabase_client import supabase

router = APIRouter()

# Verifies a user’s email after signup.
@router.post("/auth/verify-email")
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


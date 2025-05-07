from fastapi import APIRouter, HTTPException, Depends
from database.config import get_db
from sqlalchemy.orm import Session
from models import UserDetail, StudentDetail, UserRoleDetail, TutorDetail, StatusDetail, TutorSocials, TutorAffiliation, TutorAvailability, TutorExpertise, SubjectDetail
from constants.supabase_client import supabase_admin, supabase # supabase for login/signup & supabase_admin for verification
from schema import StudentSignupSchema, TutorSignupSchema
from constants.logger import logger
from constants.logger import logger
from pydantic import BaseModel

router = APIRouter()

class EmailPayload(BaseModel):
    email: str

# ----------- SIGN UP ----------------
# Verifies a user’s email after signup.
@router.post("/auth/verify-email")
def verify_email(payload: EmailPayload, db: Session = Depends(get_db)):
    try:
        email = payload.email
        logger.info(f"Starting email verification for: {email}")
        
        try:
            # Make sure to use the service role key in your Supabase client
            users = supabase_admin.auth.admin.list_users()
            logger.info(f"Successfully retrieved users from Supabase")
            
            # Find user by email
            user = next((u for u in users if u.email == email), None)
        except Exception as supabase_error:
            logger.error(f"Supabase admin API error: {str(supabase_error)}")
            raise HTTPException(
                status_code=500, 
                detail=f"Error connecting to authentication service: {str(supabase_error)}"
            )

        if not user:
            logger.info("User does not exist.")
            raise HTTPException(status_code=404, detail="User not found")
            
        # Log user details for debugging (remove in production)
        logger.info(f"User found: {user.id}, Email confirmed: {user.email_confirmed_at is not None}")

        role = user.user_metadata.get("role", [])
        # Check if user is already verified
        if user.email_confirmed_at:
            # Check if user already exists in user_detail table
            existing_user_detail = db.query(UserDetail).filter(UserDetail.userid == user.id).first()
            if existing_user_detail:
                # If user already exists, update data
                add_detail(user, role, db)
                return {"message": "User profile updated.", "email": user.email}

            # Add user to user_detail table
            new_user_detail = UserDetail(
                userid=user.id,  
                name=user.user_metadata.get("name"),
                email=user.email,
                datejoined=user.created_at.date(),  
            )

            db.add(new_user_detail) 
            db.commit()

            
            # Add user to student or tutor table
            add_detail(user, role, db)

            return {"message": "Account was successfully created.", "email": user.email}
        else:
            return {"message": "Email not yet verified", "email": user.email}

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in email verification: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

def add_detail(user, role, db):
    # Add user to student_detail table
    if "0" in role:
        create_student_profile(user, db)   

    # Query tutor status from status_detail table
    tutor_status = db.query(StatusDetail).filter(StatusDetail.status_id == '0').first()
    
    # Add user to tutor_detail table
    if "1" in role:
        create_tutor_profile(user, db, tutor_status)

def create_student_profile(user, db):
    new_student_detail = StudentDetail(
        student_id = user.id,
        student_number = user.user_metadata.get("student_number"),
        degree_program = user.user_metadata.get("degree_program"),
    )

    db.add(new_student_detail)

    # Add student user id to user_role_detail
    new_user_role = UserRoleDetail(
        user_id = user.id,
        role_id = "0"
    )

    db.add(new_user_role)
    db.commit()

def create_tutor_profile(user, db, tutor_status):
    new_tutor_detail = TutorDetail(
        tutor_id = user.id,
        status = tutor_status.status_id,
        description = user.user_metadata.get("description")
    )

    db.add(new_tutor_detail)
    db.commit()   

    # Insert affiliation
    tutor_affiliation = user.user_metadata.get("affiliation", [])
    for affiliation in tutor_affiliation:
        new_tutor_affiliation = TutorAffiliation(
            tutor_id = user.id,
            affiliations = affiliation
        )
        db.add(new_tutor_affiliation)

    # Insert expertise
    tutor_expertise = user.user_metadata.get("expertise", [])
    for expertise in tutor_expertise:
        new_tutor_expertise = TutorExpertise(
            tutor_id = user.id,
            expertise = expertise
        )
        db.add(new_tutor_expertise)

    # Insert socials
    tutor_socials = user.user_metadata.get("socials", [])
    for socials in tutor_socials:
        new_tutor_socials = TutorSocials(
            tutor_id = user.id,
            socials = socials
        )
        db.add(new_tutor_socials)

    tutor_availability = user.user_metadata.get("availability", [])
    available_time_from = user.user_metadata.get("available_time_from", [])
    available_time_to = user.user_metadata.get("available_time_to", [])

    for i in range(len(tutor_availability)):
        new_tutor_availability = TutorAvailability(
            tutor_id=user.id,
            availability = tutor_availability[i],
            available_time_from = available_time_from[i],
            available_time_to = available_time_to[i]
        )
        db.add(new_tutor_availability)

    tutor_subject = user.user_metadata.get("subject", [])
    for subject in tutor_subject:
        new_tutor_subject = SubjectDetail(
            tutor_id=user.id,
            subject_name=subject  # This is now a single string like "Calculus"
        )
        db.add(new_tutor_subject)


    db.add(UserRoleDetail(user_id=user.id, role_id="1"))
    db.commit()    

#Register a student and send verification email
@router.post("/auth/signup/student")
def signup_student(payload: StudentSignupSchema):
    try:
        user = payload.user
        student = payload.student

        # Check if the user already exists
        existing_user = get_existing_user(user)

        # Update user role from existing email
        if existing_user:
            # Obtain the role
            current_role = existing_user.user_metadata.get("role", [])

            if isinstance(current_role, str):  
                current_role = [current_role]
            
            if "0" not in current_role:
                current_role.append("0")
            else: 
                logger.info("User is already a student.")
                return {"message": "User is already a student."}


            # Ensure you are updating user metadata correctly
            supabase_admin.auth.admin.update_user_by_id(
                existing_user.id,
                {
                    "user_metadata": {  
                        "role": current_role,  
                        "student_number": student.student_number,
                        "degree_program": student.degree_program
                    }
                }
            )
            return {"message": "Signup successful. Student is now a tutor."}

        else:
            supabase.auth.sign_up({
                "email": user.email,
                "password": user.password,
                "options": {
                    "data": {
                        "name": user.name,
                        "student_number": student.student_number,
                        "degree_program": student.degree_program,
                        "role": "0",
                    }
                }
            })
            return {"message": "Student registered successfully. Email verification sent."}

    except Exception as e:
        logger.error(f"Signup failed. {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/signup/tutor")
def signup_tutor(payload: TutorSignupSchema):
    try:
        # Get payload
        user = payload.user
        tutor = payload.tutor
        availability = payload.availability.availability  
        available_time_from = payload.availability.available_time_from  
        available_time_to = payload.availability.available_time_to  
        affiliation = payload.affiliation.affiliation 
        expertise = payload.expertise.expertise  
        socials = payload.socials.socials  
        subject = payload.subject

        # Convert to ISO format
        availability = [dt.isoformat() for dt in availability]
        available_time_from = [t.isoformat() for t in available_time_from]
        available_time_to = [t.isoformat() for t in available_time_to]

        # Check if the user already exists
        existing_user = get_existing_user(user)

        if existing_user: 
            # Obtain the role
            current_role = existing_user.user_metadata.get("role", [])
            
            if isinstance(current_role, str):  # If the role is not a list, make it one
                current_role = [current_role]
            
            if "1" not in current_role:
                current_role.append("1")
            else: 
                return {"message": "User is already a tutor."}

            # Ensure you are updating user metadata correctly
            supabase_admin.auth.admin.update_user_by_id(
                existing_user.id,
                {
                    "user_metadata": {  
                        "role": current_role,  
                        "availability": availability, 
                        "available_time_from": available_time_from,
                        "available_time_to": available_time_to, 
                        "description": tutor.description,
                        "expertise": expertise,
                        "affiliation": affiliation,
                        "socials": socials,
                        "status": "0",
                        "subject": subject.subject_name
                    }
                }
            )
            return {"message": "Signup successful. Tutor is also a student."}
        else:
            supabase.auth.sign_up({
                "email": user.email,
                "password": user.password,
                "options": {
                    "data": {
                        "name": user.name,
                        "availability": availability, 
                        "available_time_from": available_time_from,
                        "available_time_to": available_time_to, 
                        "description": tutor.description,
                        "expertise": expertise,
                        "affiliation": affiliation,
                        "socials": socials,
                        "role": "1",
                        "status": "0",
                        "subject": subject.subject_name
                    }
                }
            })
            
            return {"message": "Tutor registered successfully. Email verification sent."}

    except Exception as e:
        logger.error(f"Signup failed. {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Check if the user already exists in supabase auth
def get_existing_user(user):
    # Check if the user already exists
    try:
        # Fetch all users 
        response = supabase_admin.auth.admin.list_users()
        user_list = response.users if hasattr(response, 'users') else response  # fallback for some clients
        
        # Look for matching email (case-insensitive just in case)
        existing_user = next(
            (u for u in user_list if u.email.lower() == user.email.lower()),
            None
        )
    except Exception as e:
        print("Error fetching users:", str(e))
        existing_user = None

    return existing_user



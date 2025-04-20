from fastapi import APIRouter, HTTPException, Depends
from database import get_db
from sqlalchemy.orm import Session
from models import UserDetail, StudentDetail, UserRoleDetail, TutorDetail, StatusDetail, TutorSocials, TutorAffiliation, TutorAvailability, TutorExpertise
from supabase_client import supabase
from schema import StudentSignupSchema, TutorSignupSchema
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime

router = APIRouter()

# Verifies a user’s email after signup.
@router.post("/auth/verify-email")
def verify_email(email: str, db: Session = Depends(get_db)):
    try:
        # Get all users from supabase
        users = supabase.auth.admin.list_users()

        # Find user by email
        user = next((u for u in users if u.email == email), None)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if user is already verified
        if user.email_confirmed_at:
            # Check if user already exists in user_detail table
            existing_user_detail = db.query(UserDetail).filter(UserDetail.userid == user.id).first()
            if existing_user_detail:
                # If user already exists, return a message
                return {"message": "User profile already exists", "email": user.email}

            # Add user to user_detail table
            new_user_detail = UserDetail(
                userid=user.id,  
                name=user.user_metadata.get("name"),
                email=user.email,
                datejoined=user.created_at.date(),  
            )

            db.add(new_user_detail) 
            db.commit()

            role = user.user_metadata.get("role")
            
            # Add user to user_role_detail table
            if role == "0":
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
                
            # Query tutor status from status_detail table
            tutor_status = db.query(StatusDetail).filter(StatusDetail.status_id == '0').first()

            if user.user_metadata.get("role") == "1":
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
                db.commit()

            return {"message": "Account was successfully created.", "email": user.email}
        else:
            return {"message": "Email not yet verified", "email": user.email}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Register a student and send verification email
@router.post("/auth/signup/student")
def signup_student(payload: StudentSignupSchema):
    try:
        user = payload.user
        student = payload.student
        # Check if the user already exists
        try:
            # Fetch all users 
            response = supabase.auth.admin.list_users()
            user_list = response.users if hasattr(response, 'users') else response  # fallback for some clients

            # Look for matching email (case-insensitive just in case)
            existing_user = next(
                (u for u in user_list if u.email.lower() == user.email.lower()),
                None
            )

            print("User exists:", existing_user.email if existing_user else "No user found")
            print("User ID: ", existing_user.id)

        except Exception as e:
            print("Error fetching users:", str(e))
            existing_user = None


        # Update user role from existing email
        if existing_user:
            # Obtain the role
            current_role = existing_user.user_metadata.get("role", [])

            if "0" not in current_role:
                current_role.append("0")

            # Ensure you are updating user metadata correctly
            update_response = supabase.auth.admin.update_user_by_id(
                existing_user.id,
                {
                    "user_metadata": {  
                        "role": current_role,  
                        "student_number": student.student_number,
                        "degree_program": student.degree_program
                    }
                }
            )

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

        return {"message": "Student registered successfully, verification email sent."}
    
    except Exception as e:
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

        # Convert to ISO format
        availability = [dt.isoformat() for dt in availability]
        available_time_from = [t.isoformat() for t in available_time_from]
        available_time_to = [t.isoformat() for t in available_time_to]

        # Continue with the sign-up logic
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
                    "role": ["1"],
                    "status": "0",
                }
            }
        })

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))




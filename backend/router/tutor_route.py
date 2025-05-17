from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import joinedload
from sqlalchemy.orm import Session as DBSession
from sqlalchemy import or_
from database.config import get_db
from constants.logger import logger
from pydantic import BaseModel
from models import UserDetail, TutorAffiliation, TutorDetail, TutorAvailability, TutorExpertise, TutorSocials, SubjectDetail, StudentDetail, Session, TopicDetail
from uuid import UUID
from datetime import date, time
from .user_route import require_role, verify_token

router = APIRouter()

class TutorResponse(BaseModel):
    userid: UUID
    name: Optional[str] = None
    email: str
    datejoined: date
    subject: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    affiliations: Optional[List[str]] = None
    availability: Optional[List[date]] = None
    available_time_from: Optional[List[time]] = None
    available_time_to: Optional[List[time]] = None
    expertise: Optional[List[str]] = None
    socials: Optional[List[str]] = None

    class Config:
        from_attributes = True

class TutorsListResponse(BaseModel):
    tutors: List[TutorResponse]
    total: int
    page: int
    limit: int

# Retrieve tutor list
@router.get("/tutors", response_model=TutorsListResponse)
async def get_tutors(
    name: Optional[str] = None,  # search by name
    expertise_filter: Optional[str] = None, # search by expertise
    status: Optional[str] = None, # search by status
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: DBSession = Depends(get_db),
):
    try:
        # Build query with all joins at once
        query = db.query(UserDetail)\
            .join(TutorDetail, UserDetail.userid == TutorDetail.tutor_id)\
            .outerjoin(TutorAffiliation, UserDetail.userid == TutorAffiliation.tutor_id)\
            .outerjoin(TutorAvailability, UserDetail.userid == TutorAvailability.tutor_id)\
            .outerjoin(TutorExpertise, UserDetail.userid == TutorExpertise.tutor_id)\
            .outerjoin(TutorSocials, UserDetail.userid == TutorSocials.tutor_id)\
            .outerjoin(SubjectDetail, UserDetail.userid == SubjectDetail.tutor_id)\
            .options(
                joinedload(UserDetail.tutor_detail),
                joinedload(UserDetail.tutor_affiliation),
                joinedload(UserDetail.tutor_availability),
                joinedload(UserDetail.tutor_expertise),
                joinedload(UserDetail.tutor_socials),
                joinedload(UserDetail.subject_detail)
            )
        
        # filters when searching for tutors pero optional pa muna 
        if name:
            query = query.filter(UserDetail.name.ilike(f"%{name}%"))
        
        if status:
            query = query.filter(TutorDetail.status == status)
            
        if expertise_filter:
            query = query.filter(TutorExpertise.expertise.contains([expertise_filter]))
        
        # Count total results before pagination
        total_count = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        users = query.offset(offset).limit(limit).all()
        
        # response data 
        tutors_data = []
        for user in users:
            tutor_data = {
                "userid": user.userid,
                "name": user.name,
                "email": user.email,
                "datejoined": user.datejoined,
                "subject": user.subject_detail.subject_name if hasattr(user, 'subject_detail') and user.subject_detail else None,
                "description": user.tutor_detail.description if hasattr(user, 'tutor_detail') and user.tutor_detail else None,
                "status": str(user.tutor_detail.status) if hasattr(user, 'tutor_detail') and user.tutor_detail else None,
                "affiliations": [user.tutor_affiliation.affiliations] if hasattr(user, 'tutor_affiliation') and user.tutor_affiliation else None,
                "availability": [user.tutor_availability.availability] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
                "available_time_from": [user.tutor_availability.available_time_from] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
                "available_time_to": [user.tutor_availability.available_time_to] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
                "expertise": [user.tutor_expertise.expertise] if hasattr(user, 'tutor_expertise') and user.tutor_expertise else None,
                "socials": [user.tutor_socials.socials] if hasattr(user, 'tutor_socials') and user.tutor_socials else None
            }
            tutors_data.append(tutor_data)
        
        return {
            "tutors": tutors_data,
            "total": total_count,
            "page": page,
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Error fetching tutors: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching tutors: {str(e)}")

# View tutor details
@router.get("/tutors/{tutor_id}", response_model=TutorResponse)
async def get_tutor_by_id( tutor_id: str ,db: DBSession = Depends(get_db)):
    try:

        if tutor_id is None:
            logger.error("Tutor ID is required")
            raise HTTPException(status_code=400, detail="Tutor ID is required")
        # Validate UUID format
        try:
            tutor_id = UUID(tutor_id)
        except ValueError:
            logger.error("Invalid UUID format")
            raise HTTPException(status_code=400, detail="Invalid UUID format")

        # Build query with all joins at once
        query = db.query(UserDetail)\
            .join(TutorDetail, UserDetail.userid == TutorDetail.tutor_id)\
            .outerjoin(TutorAffiliation, UserDetail.userid == TutorAffiliation.tutor_id)\
            .outerjoin(TutorAvailability, UserDetail.userid == TutorAvailability.tutor_id)\
            .outerjoin(TutorExpertise, UserDetail.userid == TutorExpertise.tutor_id)\
            .outerjoin(TutorSocials, UserDetail.userid == TutorSocials.tutor_id)\
            .outerjoin(SubjectDetail, UserDetail.userid == SubjectDetail.tutor_id)\
            .options(
                joinedload(UserDetail.tutor_detail),
                joinedload(UserDetail.tutor_affiliation),
                joinedload(UserDetail.tutor_availability),
                joinedload(UserDetail.tutor_expertise),
                joinedload(UserDetail.tutor_socials)
            )

        query = query.filter(TutorDetail.tutor_id == tutor_id)
        user = query.first()

        tutor_data = {
            "userid": user.userid,
            "name": user.name,
            "email": user.email,
            "datejoined": user.datejoined,
            "subject": user.subject_detail.subject_name if hasattr(user, 'subject_detail') and user.subject_detail else None,
            "description": user.tutor_detail.description if hasattr(user, 'tutor_detail') and user.tutor_detail else None,
            "status": str(user.tutor_detail.status) if hasattr(user, 'tutor_detail') and user.tutor_detail else None,
            "affiliations": [user.tutor_affiliation.affiliations] if hasattr(user, 'tutor_affiliation') and user.tutor_affiliation else None,
            "availability": [user.tutor_availability.availability] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
            "available_time_from": [user.tutor_availability.available_time_from] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
            "available_time_to": [user.tutor_availability.available_time_to] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
            "expertise": [user.tutor_expertise.expertise] if hasattr(user, 'tutor_expertise') and user.tutor_expertise else None,
            "socials": [user.tutor_socials.socials] if hasattr(user, 'tutor_socials') and user.tutor_socials else None
        }

        return tutor_data;

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching tutor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching tutor: {str(e)}")

# Get student requests of tutor
@router.get("/tutor/student-requests")
def get_students_for_tutor( user=Depends(require_role([1])), db: DBSession = Depends(get_db)):
    tutor_id = user["user_id"]

    students = (
        db.query(
            UserDetail.name,
            SubjectDetail.subject_name,
            TopicDetail.topic_title,
            Session.date,
            Session.time,
            Session.session_id
        )
        .join(StudentDetail, StudentDetail.student_id == Session.student_id)
        .join(UserDetail, UserDetail.userid == StudentDetail.student_id)
        .join(TopicDetail, TopicDetail.topic_id == Session.topic_id)
        .join(SubjectDetail, SubjectDetail.subject_id == TopicDetail.subject_id)
        .filter(Session.tutor_id == tutor_id)
        .filter(Session.status == "0")
        .all()
    )

    return [
        {
            "name": s.name,
            "subject": s.subject_name,
            "topic": s.topic_title,
            "date": s.date.isoformat(),
            "time": s.time.strftime("%H:%M"),
            "session_id": s.session_id
        }
        for s in students
    ]

@router.get("/tutor-requests")
def get_tutor_requests(db: DBSession = Depends(get_db)):
    try:
        tutor_requests = (
            db.query(
                UserDetail.name.label("tutor_name"),
                UserDetail.email,
                TutorDetail.tutor_id,
                TutorDetail.status.label("status_id"),
                TutorExpertise.expertise, 
                SubjectDetail.subject_name,
            )
            .join(TutorDetail, TutorDetail.tutor_id == UserDetail.userid)
            .join(TutorExpertise, TutorExpertise.tutor_id == TutorDetail.tutor_id)
            .join(SubjectDetail, SubjectDetail.tutor_id == TutorDetail.tutor_id)
            .filter(TutorDetail.status == 0)
            .all()
        )

        return {
            "tutor_requests": [
                {
                    "tutor_name": r.tutor_name,
                    "email": r.email,
                    "subject": r.subject_name,
                    "status_id": r.status_id,
                    "expertise": r.expertise,
                    "tutor_id": r.tutor_id
                }
                for r in tutor_requests
            ]
        }

    except Exception as e:
        logger.error(f"Error retrieving tutor requests: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")


class StatusUpdate(BaseModel):
    status: int  # 1 for approve, 2 for reject

@router.put("/tutor-requests/{tutor_id}/status")
def update_tutor_status(tutor_id: str, update: StatusUpdate, db: DBSession = Depends(get_db)):
    tutor = db.query(TutorDetail).filter_by(tutor_id=tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    
    tutor.status = update.status
    db.commit()
    logger.info(f"Tutor status updated to {tutor.status} for tutor_id={tutor.tutor_id}")

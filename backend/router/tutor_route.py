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
from datetime import date
from .user_route import require_role, verify_token

router = APIRouter()

class TutorResponse(BaseModel):
    userid: UUID
    name: Optional[str] = None
    email: str
    datejoined: date
    subject: Optional[List[str]] = None
    topic_title: Optional[List[str]] = None
    topic_id: Optional[List[UUID]] = None
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

class StatusUpdate(BaseModel):
    status: int  # 1 for approve, 2 for reject

@router.get("/tutors", response_model=TutorsListResponse)
async def get_tutors_optimized(
    name: Optional[str] = None,
    expertise_filter: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: DBSession = Depends(get_db),
):
    try:
        # Get base tutors with filters

        base_query = db.query(UserDetail.userid)\
            .join(TutorDetail, UserDetail.userid == TutorDetail.tutor_id)
        
        if name:
            base_query = base_query.filter(UserDetail.name.ilike(f"%{name}%"))
        if status:
            base_query = base_query.filter(TutorDetail.status == status)
        if expertise_filter:
            base_query = base_query.join(TutorExpertise, UserDetail.userid == TutorExpertise.tutor_id)\
                .filter(TutorExpertise.expertise.contains([expertise_filter]))
        
        # Count and paginate
        total_count = base_query.count()
        offset = (page - 1) * limit
        tutor_ids = [row.userid for row in base_query.offset(offset).limit(limit).all()]

        
        if not tutor_ids:
            return {"tutors": [], "total": total_count, "page": page, "limit": limit}

        
        # Get user details
        users = db.query(UserDetail).filter(UserDetail.userid.in_(tutor_ids)).all()
        user_dict = {user.userid: user for user in users}
        
        # Get tutor details
        tutor_details = db.query(TutorDetail).filter(TutorDetail.tutor_id.in_(tutor_ids)).all()
        tutor_dict = {td.tutor_id: td for td in tutor_details}
        
        # Get all related data using separate queries
        affiliations = db.query(TutorAffiliation).filter(TutorAffiliation.tutor_id.in_(tutor_ids)).all()
        availabilities = db.query(TutorAvailability).filter(TutorAvailability.tutor_id.in_(tutor_ids)).all()
        expertise = db.query(TutorExpertise).filter(TutorExpertise.tutor_id.in_(tutor_ids)).all()
        socials = db.query(TutorSocials).filter(TutorSocials.tutor_id.in_(tutor_ids)).all()
        subjects = db.query(SubjectDetail).filter(SubjectDetail.tutor_id.in_(tutor_ids)).all()
        
        # Group related data by tutor_id

        from collections import defaultdict
        
        affiliations_dict = defaultdict(list)
        for aff in affiliations:
            if aff.affiliations:
                affiliations_dict[aff.tutor_id].append(aff.affiliations)
        
        availability_dict = defaultdict(list)
        time_from_dict = defaultdict(list)
        time_to_dict = defaultdict(list)
        for avail in availabilities:
            if avail.availability:
                availability_dict[avail.tutor_id].append(avail.availability)
            if avail.available_time_from:
                time_from_dict[avail.tutor_id].append(avail.available_time_from)
            if avail.available_time_to:

                time_to_dict[avail.tutor_id].append(avail.available_time_to)
        
        expertise_dict = defaultdict(list)
        for exp in expertise:
            if exp.expertise:
                if isinstance(exp.expertise, list):
                    expertise_dict[exp.tutor_id].extend(exp.expertise)
                else:
                    expertise_dict[exp.tutor_id].append(exp.expertise)
        
        socials_dict = defaultdict(list)

        for social in socials:
            if social.socials:
                socials_dict[social.tutor_id].append(social.socials)
        
        subjects_dict = defaultdict(list)
        for subject in subjects:
            if subject.subject_name:
                subjects_dict[subject.tutor_id].append(subject.subject_name)
        
        # Build final response

        tutors_data = []
        for tutor_id in tutor_ids:
            user = user_dict.get(tutor_id)
            tutor_detail = tutor_dict.get(tutor_id)

            
            if user:
                tutor_data = {
                    "userid": user.userid,
                    "name": user.name,
                    "email": user.email,
                    "datejoined": user.datejoined,
                    "subject": subjects_dict[tutor_id] if subjects_dict[tutor_id] else None,
                    "topic_title": None,
                    "topic_id": None,
                    "description": tutor_detail.description if tutor_detail else None,
                    "status": str(tutor_detail.status) if tutor_detail else None,
                    "affiliations": affiliations_dict[tutor_id] if affiliations_dict[tutor_id] else None,
                    "availability": availability_dict[tutor_id] if availability_dict[tutor_id] else None,
                    "available_time_from": time_from_dict[tutor_id] if time_from_dict[tutor_id] else None,
                    "available_time_to": time_to_dict[tutor_id] if time_to_dict[tutor_id] else None,
                    "expertise": expertise_dict[tutor_id] if expertise_dict[tutor_id] else None,
                    "socials": socials_dict[tutor_id] if socials_dict[tutor_id] else None
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
async def get_tutor_by_id(tutor_id: str, db: DBSession = Depends(get_db)):
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
        

        # Query the user/tutor
        query = db.query(UserDetail)\
            .join(TutorDetail, UserDetail.userid == TutorDetail.tutor_id)\
            .outerjoin(TutorAffiliation, UserDetail.userid == TutorAffiliation.tutor_id)\
            .outerjoin(TutorAvailability, UserDetail.userid == TutorAvailability.tutor_id)\
            .outerjoin(TutorExpertise, UserDetail.userid == TutorExpertise.tutor_id)\
            .outerjoin(TutorSocials, UserDetail.userid == TutorSocials.tutor_id)\
            .options(

                joinedload(UserDetail.tutor_detail),
                joinedload(UserDetail.tutor_affiliation),
                joinedload(UserDetail.tutor_availability),
                joinedload(UserDetail.tutor_expertise),
                joinedload(UserDetail.tutor_socials)
            )
        
        # Filter by tutor_id

        query = query.filter(UserDetail.userid == tutor_id)
        user = query.first()
        
        if not user:
            logger.error(f"Tutor with ID {tutor_id} not found")
            raise HTTPException(status_code=404, detail="Tutor not found")
        
        # Query for all subjects associated with this tutor
        subjects = db.query(SubjectDetail)\
            .filter(SubjectDetail.tutor_id == tutor_id)\
            .all()

        
        subject_names = [subject.subject_name for subject in subjects] if subjects else []
        subject_ids = [subject.subject_id for subject in subjects] if subjects else []
        

       # Query for all topics related to the tutor's subjects
        topics = []
        if subject_ids:
            # Debug output for subject IDs
            logger.info(f"Querying topics for subject IDs: {subject_ids}")
            print(f"Querying topics for subject IDs: {subject_ids}")
            
            # Execute query with explicit column selection to ensure topic_title is retrieved

            topics_query = db.query(TopicDetail.topic_id, TopicDetail.subject_id, TopicDetail.topic_title)\
                .filter(TopicDetail.subject_id.in_(subject_ids))\
                .all()
            
            # Debug output for found topics
            logger.info(f"Found topics: {topics_query}")
            print(f"Found topics: {topics_query}")
            
            # Extract topic titles, with checks to ensure topic_title exists
            topic_titles = []
            for topic in topics_query:
                if hasattr(topic, 'topic_title') and topic.topic_title:
                    print(f"Topic title found: {topic.topic_title}")
                    topic_titles.append(topic.topic_title)
                elif isinstance(topic, tuple) and len(topic) >= 3 and topic[2]:
                    print(f"Topic title found in tuple: {topic[2]}")
                    topic_titles.append(topic[2])
            topic_id = []
            for topic in topics_query:
                if hasattr(topic, 'topic_id') and topic.topic_id:
                    topic_id.append(topic.topic_id)
                    print(f"Topic ID found: {topic.topic_id}")
                elif isinstance(topic, tuple) and len(topic) >= 3 and topic[2]:
                    topic_id.append(topic[2])
                    print(f"Topic ID found in tuple: {topic[2]}")
        else:
            topic_titles = []
            topic_id = []
        
        tutor_data = {
            "userid": user.userid,
            "name": user.name,
            "email": user.email,
            "datejoined": user.datejoined,
            "subject": subject_names,
            "topic_title": topic_titles,
            "topic_id": topic_id,
            "description": user.tutor_detail.description if hasattr(user, 'tutor_detail') and user.tutor_detail else None,
            "status": str(user.tutor_detail.status) if hasattr(user, 'tutor_detail') and user.tutor_detail else None,
            "affiliations": [user.tutor_affiliation.affiliations] if hasattr(user, 'tutor_affiliation') and user.tutor_affiliation else None,
            "availability": [user.tutor_availability.availability] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
            "available_time_from": [user.tutor_availability.available_time_from] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
            "available_time_to": [user.tutor_availability.available_time_to] if hasattr(user, 'tutor_availability') and user.tutor_availability else None,
            "expertise": [user.tutor_expertise.expertise] if hasattr(user, 'tutor_expertise') and user.tutor_expertise else None,
            "socials": [user.tutor_socials.socials] if hasattr(user, 'tutor_socials') and user.tutor_socials else None
        }
        
        return tutor_data
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

@router.put("/tutor-requests/{tutor_id}/status")
def update_tutor_status(tutor_id: str, update: StatusUpdate, db: DBSession = Depends(get_db)):
    tutor = db.query(TutorDetail).filter_by(tutor_id=tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    
    tutor.status = update.status
    db.commit()
    logger.info(f"Tutor status updated to {tutor.status} for tutor_id={tutor.tutor_id}")


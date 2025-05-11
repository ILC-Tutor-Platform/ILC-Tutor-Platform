from fastapi import APIRouter, Depends, HTTPException
from .user_route import require_role
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.config import get_db
from models import SubjectDetail, Session, StatusDetail, UserDetail, TopicDetail, StudentDetail
from constants.logger import logger
from pydantic import BaseModel

router = APIRouter()

class SessionStatusUpdate(BaseModel):
    session_id:str
    status_id: int

# Tutor API to accept session requests
@router.post("/session/update-requests")
def update_session_status( payload: SessionStatusUpdate, user=Depends(require_role([1])), db: Session = Depends(get_db)):
    try: 
        uid = user["user_id"]
        session_id = payload.session_id

        session = db.query(Session).filter(Session.session_id == session_id).first()
        if not session:
            logger.info(f"Session {session_id} does not exist.")
            raise HTTPException(status_code=404, detail="Session not found")
        
        if str(session.tutor_id) != str(uid):
            logger.info(f"User {uid} is not allowed to accept sessions.")
            raise HTTPException(status_code=403, detail="Permission denied.")

        status_obj = db.query(StatusDetail).filter(StatusDetail.status_id == payload.status_id).first()
        if not status_obj: 
            raise HTTPException(status_code=403, detail=f"Status {payload.status} did not match the desired status value.")
        
        session.status = status_obj.status_id 
        
        db.commit()

        logger.info(f"Session {session_id} was accepted by the tutor {session.tutor_id}")
    except Exception as e:
        logger.error(f"Error retrieving sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")

# Tutor views accepted student sessions
@router.get("/sessions/accepted-requests")
def get_student_accepted_requests(user=Depends(require_role([0])), db: Session = Depends(get_db)):
    uid = user["user_id"]  # Tutor's ID

    try:
        # Join necessary tables to fetch student name, subject, and topic
        sessions = (
            db.query(
                UserDetail.name.label("student_name"),
                SubjectDetail.subject_name,
                TopicDetail.topic_title,
                Session.date,
                Session.time,
                Session.session_id,
                Session.status
            )
            .join(StudentDetail, StudentDetail.student_id == Session.student_id)
            .join(UserDetail, UserDetail.userid == StudentDetail.student_id)
            .join(TopicDetail, TopicDetail.topic_id == Session.topic_id)
            .join(SubjectDetail, SubjectDetail.subject_id == TopicDetail.subject_id)
            .filter(Session.tutor_id == uid)
            .filter(Session.status == 1)
            .all()
        )

        logger.info("Fetching accepted sessions with student info for tutor")
        return {
            "session": [
                {
                    "name": s.student_name,
                    "subject": s.subject_name,
                    "topic": s.topic_title,
                    "date": s.date.isoformat(),
                    "time": s.time.strftime("%H:%M"),
                    "session_id": s.session_id,
                    "status": s.status
                }
                for s in sessions
            ]
        }

    except Exception as e:
        logger.error(f"Error retrieving sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Student views accepted sessions
@router.get("/sessions/approved-sessions")
def get_approved_requests(user=Depends(require_role([1])), db: Session = Depends(get_db)):
    uid = user["user_id"]  # Tutor's ID

    try:
        sessions = (
            db.query(
                UserDetail.name.label("student_name"),
                SubjectDetail.subject_name,
                TopicDetail.topic_title,
                Session.date,
                Session.time,
                Session.session_id,
                Session.status
            )
            .join(StudentDetail, StudentDetail.student_id == Session.student_id)
            .join(UserDetail, UserDetail.userid == StudentDetail.student_id)
            .join(TopicDetail, TopicDetail.topic_id == Session.topic_id)
            .join(SubjectDetail, SubjectDetail.subject_id == TopicDetail.subject_id)
            .filter(Session.tutor_id == uid)
            .filter(Session.status == 1)
            .all()
        )

        logger.info("Fetching accepted sessions with student info for tutor")
        return {
            "session": [
                {
                    "name": s.student_name,
                    "subject": s.subject_name,
                    "topic": s.topic_title,
                    "date": s.date.isoformat(),
                    "time": s.time.strftime("%H:%M"),
                    "session_id": s.session_id,
                    "status": s.status
                }
                for s in sessions
            ]
        }

    except Exception as e:
        logger.error(f"Error retrieving sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

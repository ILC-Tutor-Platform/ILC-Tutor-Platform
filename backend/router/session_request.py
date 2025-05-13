from fastapi import APIRouter, Depends, HTTPException
from .user_route import require_role, verify_token
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.config import get_db
from models import Session, StatusDetail, UserDetail
from constants.logger import logger
from pydantic import BaseModel
from datetime import date, time

router = APIRouter()

class SessionStatusUpdate(BaseModel):
    status: str

# Payload definition
class SessionRequestPayload(BaseModel):
    date: date
    time: time

    tutor_id: str
    student_id: str
    topic_id: str
    status: str
    time_started: Optional[time] = None
    time_ended: Optional[time] = None
    duration: Optional[int] = None  
    room_number: Optional[str] = None
    modality: str
    
    class Config:
        from_attributes = True



# Tutor API to view session requests
@router.get("/tutors/requests")
def view_session_requests(user=Depends(require_role([1])), db: Session = Depends(get_db)):
    try:
        uid = user["user_id"]
        pending_session_requests = []

        session = db.query(Session).filter(UserDetail.userid == uid).all()    
        for s in session:
           if s.status == 0:
               pending_session_requests.append(s) 
    
        return pending_session_requests
    except Exception as e:
        logger.error(f"Error retrieving tutor requests: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")

# Tutor API to accept session requests
@router.post("/requests/{session_id}")
def update_session_status( session_id: str, payload: SessionStatusUpdate, user=Depends(require_role([1])), db: Session = Depends(get_db)):
    try: 
        uid = user["user_id"]

        session = db.query(Session).filter(Session.session_id == session_id).first()
        if not session:
            logger.info(f"Session {session_id} does not exist.")
            raise HTTPException(status_code=404, detail="Session not found")
        
        if str(session.tutor_id) != str(uid):
            logger.info(f"User {uid} is not allowed to accept sessions.")
            raise HTTPException(status_code=403, detail="Permission denied.")

        status_obj = db.query(StatusDetail).filter(StatusDetail.status == payload.status).first()
        if not status_obj: 
            raise HTTPException(status_code=403, detail=f"Status {payload.status} did not match the desired status value.")
        
        session.status = status_obj.status_id 
        
        db.commit()

        logger.info(f"Session {session_id} was accepted by the tutor {session.tutor_id}")
    except Exception as e:
        logger.error(f"Error retrieving sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")

# User views sessions
@router.get("/sessions")
def get_sessions_by_user(user= Depends(verify_token), db: Session = Depends(get_db)):
    uid = user["user_id"] 

    try:
        # Retrieve sessions of a student or tutor
        sessions = db.query(Session).filter(
            or_(
                Session.tutor_id == uid,
                Session.student_id == uid
            )
        ).all()

        logger.info("Fetching sessions from Supabase")
        return {"session": [ 
            {
                "session_id": session.session_id,
                "date": session.date.isoformat(),
                "time": session.time.strftime("%H:%M:%S"),
                "tutor_id": session.tutor_id,
                "student_id": session.student_id,
                "topic_id": session.topic_id,
                "status": session.status,
                "time_started": session.time_started.strftime("%H:%M:%S") if session.time_started else None,
                "time_ended": session.time_ended.strftime("%H:%M:%S") if session.time_ended else None,
                "duration": session.duration,
                "room_number": session.room_number if session.room_number else None,
                "modality": session.modality
            } 
            for session in sessions
        ]}
    except Exception as e:
        logger.error(f"Error retrieving sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")


# Student API to request sessions from tutor
@router.post("/student/request/session", response_model=SessionRequestPayload)
def request_session(user=Depends(require_role([0])), db: Session = Depends(get_db), payload: SessionRequestPayload):
    
    # Validation checks
    if payload is None:
        logger.error("Invalid payload")
        raise HTTPException(status_code=400, detail="Invalid payload")
        
    if payload.tutor_id is None:
        logger.error("Tutor ID is required")
        raise HTTPException(status_code=400, detail="Tutor ID is required")
        
    if payload.student_id is None:
        logger.error("Student ID is required")
        raise HTTPException(status_code=400, detail="Student ID is required")
    
    # Check for existing pending session with same parameters
    existing_session = db.query(SessionModel).filter(
        SessionModel.tutor_id == payload.tutor_id,
        SessionModel.topic_id == payload.topic_id,
        SessionModel.date == payload.date,
        SessionModel.time == payload.time,
        SessionModel.student_id == payload.student_id,
        SessionModel.status == "pending"
    ).first()
    
    if existing_session:

        logger.warning(f"Duplicate session request detected for student {payload.student_id} with tutor {payload.tutor_id}")
        raise HTTPException(
            status_code=409, 
            detail="A session request with the same tutor, topic, date, and time is already pending. Please wait for a response or cancel the existing request."
        )
        
    logger.info(f"Requesting session with tutor {payload.tutor_id} for student {payload.student_id}")
    
    try:
        session = SessionModel(
            date=payload.date,
            time=payload.time,
            tutor_id=payload.tutor_id,
            student_id=payload.student_id,
            topic_id=payload.topic_id,
            status="pending",  # Default to pending status for new requests
            time_started=payload.time_started,
            time_ended=payload.time_ended,
            duration=payload.duration,
            room_number=payload.room_number,
            modality=payload.modality
        )
        db.add(session)

        db.commit()

        db.refresh(session)

        return session
    

    except Exception as e:
        logger.error(f"Error requesting session: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

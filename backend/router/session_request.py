from fastapi import APIRouter, Depends, HTTPException
from .user_route import require_role, verify_token
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.config import get_db
from models import Session, StatusDetail
from constants.logger import logger
from pydantic import BaseModel
from constants.supabase_client import supabase


router = APIRouter()

class SessionStatusUpdate(BaseModel):
    status: str

@router.post("/sessions/requests/{session_id}")
def update_session_status( session_id: str, payload: SessionStatusUpdate, user=Depends(verify_token), db: Session = Depends(get_db)):
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
        
        session.status = status_obj.status_id
        
        db.commit()

        logger.info(f"Session {session_id} was accepted by the tutor {session.tutor_id}")
    except Exception as e:
        logger.error(f"Error retrieving sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")
    
@router.get("/sessions")
def get_sessions_by_user(user= Depends(verify_token), db: Session = Depends(get_db)):
    uid = user["user_id"] 
    logger.info(f"uid: {uid}")
    try:
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
                "room_number": session.room_number,
                "modality": session.modality
            } 
            for session in sessions
        ]}
    except Exception as e:
        logger.error(f"Error retrieving sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")

# Get specific details to session
@router.get("sessions/{session_id}")
def get_session(session_id: str , db: Session = Depends(get_db), user=Depends(require_role([1]))):
    if user:
        try:
            session = db.query(Session).filter(Session.session_id == session_id).first()
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
            
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
                    "time_started": session.time_started.strftime("%H:%M:%S"),
                    "time_ended": session.time_ended.strftime("%H:%M:%S"),
                    "duration": session.duration,
                    "room": session.room,
                    "modality": session.modality
                } 
                for session in sessions
            ]}
        except Exception as e:
            logger.error(f"Error retrieving sessions: {e}")
            raise HTTPException(status_code=500, detail="Internal server error during authentication")
    else:
        logger.error("User is not allowed to view this endpoint.")
        raise HTTPException(status_code=500, detail="Permission denied.")
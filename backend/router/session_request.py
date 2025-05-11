from fastapi import APIRouter, Depends, HTTPException
from .user_route import require_role, verify_token
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.config import get_db
from models import Session, StatusDetail, UserDetail
from constants.logger import logger
from pydantic import BaseModel

router = APIRouter()

class SessionStatusUpdate(BaseModel):
    status: str

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

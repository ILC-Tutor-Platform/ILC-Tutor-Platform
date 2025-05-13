from sqlalchemy import Column, ForeignKey, Integer, Date, Time, String
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Session(Base):
    __tablename__ = "session"

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_detail.student_id"), nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topic_detail.topic_id"), nullable=True)
    status = Column(Integer, ForeignKey("status_detail.status_id"), nullable=False)
    time_started = Column(Time, nullable=True)
    time_ended = Column(Time, nullable=True)
    duration = Column(Integer, nullable=True)    
    room_number = Column(String, nullable=True)   
    modality = Column(String, nullable=False)


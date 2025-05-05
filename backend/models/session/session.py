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
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topic_detail.topic_id"), nullable=False)
    status = Column(String, nullable=False)
    time_started = Column(Time, nullable=False)
    time_ended = Column(Time, nullable=False)
    duration = Column(Integer, nullable=False)    
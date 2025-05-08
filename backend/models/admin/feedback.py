from sqlalchemy import Column, ForeignKey, Date, Time, String
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_detail.student_id"), nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"), nullable=False)
    description = Column(String, nullable=False)
    feedback_status = Column(String, nullable=False)
    title = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    date_resolved = Column(Date, nullable=True)

from sqlalchemy import Column, ForeignKey
from . import Base
from sqlalchemy.dialects.postgresql import UUID

class SessionHistory(Base):
    __tablename__ = "session_history"

    session_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_detail.student_id"), nullable=False)


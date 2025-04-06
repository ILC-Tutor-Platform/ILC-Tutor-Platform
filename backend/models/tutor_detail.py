from sqlalchemy import Column, String, ForeignKey, Integer
from . import Base
from database import engine
from sqlalchemy.dialects.postgresql import UUID
import uuid

class TutorDetail(Base):
    __tablename__ = "tutor_detail"

    tutor_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, index=True)
    expertise = Column(String, nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subject.subject_id"), nullable=False)
    availability = Column(String, nullable=False)
    description = Column(String, nullable=False)
    social_media_links = Column(String, nullable=False)
    status = Column(Integer, ForeignKey("status_detail.status_id"), nullable=False)
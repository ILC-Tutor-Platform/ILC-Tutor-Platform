from sqlalchemy import Column, ForeignKey, Integer, Date, Time, String
from . import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class SubjectOffered(Base):
    __tablename__ = "subject_offered"

    subject_offered_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subject_detail.subject_id"), nullable=False)

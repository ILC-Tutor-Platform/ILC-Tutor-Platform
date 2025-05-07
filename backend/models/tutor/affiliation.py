from sqlalchemy import Column, ForeignKey, String
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class TutorAffiliation(Base):
    __tablename__ = "tutor_affiliation"

    tutor_affiliation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"))
    affiliations = Column(String, nullable=True)


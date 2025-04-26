from sqlalchemy import Column, UUID, ForeignKey, String
from models import Base
import uuid

class TutorSocials(Base):
    __tablename__ = "tutor_socials"

    tutor_socials_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"))
    socials = Column(String, nullable=True)
from sqlalchemy import Column, ForeignKey, String
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.orm import relationship

class TutorExpertise(Base):
    __tablename__ = "tutor_expertise"

    tutor_expertise_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), nullable=False)
    expertise = Column(String, nullable=False)

    user = relationship("UserDetail", back_populates="tutor_expertise")
from sqlalchemy import Column, UUID, ForeignKey, String
from models import Base
import uuid
from sqlalchemy.orm import relationship

class TutorSocials(Base):
    __tablename__ = "tutor_socials"

    tutor_socials_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"))
    socials = Column(String, nullable=True)

    user = relationship("UserDetail", back_populates="tutor_socials")
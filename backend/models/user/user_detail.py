# Description: This file contains the ORM model for the UserDetail table that will be used to create the table in the database.
from sqlalchemy import Column, Date, String
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.orm import relationship

# Define ORM model
class UserDetail(Base):
    __tablename__ = "user_detail"

    userid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    datejoined = Column(Date, nullable=False)
    image_public_url = Column(String, nullable = True)

    # Relationships - tutor and user_detail
    tutor_detail = relationship("TutorDetail", back_populates="user", uselist=False)
    tutor_affiliation = relationship("TutorAffiliation", back_populates="user", uselist=False)
    tutor_availability = relationship("TutorAvailability", back_populates="user", uselist=False)
    tutor_expertise = relationship("TutorExpertise", back_populates="user", uselist=False)
    tutor_socials = relationship("TutorSocials", back_populates="user", uselist=False)
    subject_detail = relationship("SubjectDetail", back_populates="user", uselist=False)

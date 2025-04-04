# Description: This file contains the ORM model for the UserDetail table that will be used to create the table in the database.

from sqlalchemy import Column, Integer, Date, String, ForeignKey, text
from database import Base, engine  # Directly import engine
from sqlalchemy.dialects.postgresql import UUID

# Define ORM model
class UserDetail(Base):
    __tablename__ = "user_detail"

    userid = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()")) # added server_default="gen_random_uuid()" to auto generate a uuid
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)
    datejoined = Column(Date, nullable=False)

class AdminDetail(Base):
    __tablename__ = "admin_detail"

    admin_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, index=True)
    admin_role = Column(String, nullable=False)

class StudentDetail(Base):
    __tablename__ = "student_detail"

    student_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, index=True)
    student_number = Column(String, unique=True, index=True, nullable=False)
    interests = Column(String, nullable=False)
    degree_program = Column(String, nullable=False)

class TutorDetail(Base):
    __tablename__ = "tutor_detail"

    tutor_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, index=True)
    expertise = Column(String, nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subject.subject_id"), nullable=False)
    availability = Column(String, nullable=False)
    description = Column(String, nullable=False)
    social_media_links = Column(String, nullable=False)
    status = Column(Integer, ForeignKey("status_detail.status_id"), nullable=False)

class StatusDetail(Base):
    __tablename__ = "status_detail"

    status_id = Column(Integer, primary_key=True, index=True)
    status = Column(String, nullable=False)

class SubjectDetail(Base):
    __tablename__ = "subject"

    subject_id = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()")) # added server_default="gen_random_uuid()" to auto generate a uuid
    subject_name = Column(String, nullable=False)
    subject_description = Column(String, unique=True, index=True, nullable=False)

# Create Tables
print("🚀 Attempting to create tables in Supabase...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
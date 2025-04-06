# Description: This file contains the ORM model for the UserDetail table that will be used to create the table in the database.
from sqlalchemy import Column, Integer, Date, String
from . import Base
from database import engine
from sqlalchemy.dialects.postgresql import UUID
import uuid

# Define ORM model
class UserDetail(Base):
    __tablename__ = "user_detail"

    userid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    # role = Column(String, nullable=True)
    datejoined = Column(Date, nullable=False)

# Create Tables
print("🚀 Attempting to create tables in Supabase...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")

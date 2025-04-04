# Description: This file contains the ORM model for the UserDetail table that will be used to create the table in the database.

from sqlalchemy import Column, Integer, Date, String
from database import Base, engine  # Directly import engine

# Define ORM model
class UserDetail(Base):
    __tablename__ = "user_detail"

    userid = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)
    datejoined = Column(Date, nullable=False)

# Create Tables
print("🚀 Attempting to create tables in Supabase...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")

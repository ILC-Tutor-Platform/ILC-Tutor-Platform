# Description: This file contains the ORM model for the UserDetail table that will be used to create the table in the database.

from sqlalchemy import Column, Integer, Date, String, ForeignKey, text
from database import Base, engine  # Directly import engine
from sqlalchemy.dialects.postgresql import UUID

# Define ORM model
class UserDetail(Base):
    __tablename__ = "user_detail"
# # Description: This file contains the ORM model for the UserDetail table that will be used to create the table in the database.
# from sqlalchemy import Column, Integer, Date, String
# from sqlalchemy.dialects.postgresql import UUID
# from database import Base, engine 
# import uuid


# # Define ORM model
# class UserDetail(Base):
#     __tablename__ = "user_detail"

    userid = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()")) # added server_default="gen_random_uuid()" to auto generate a uuid
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    #role = Column(Integer, ForeignKey("role_detail.role_id"), nullable=False) # remove this since it is not used in the table
    datejoined = Column(Date, nullable=False)
#     userid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     name = Column(String, nullable=False)
#     email = Column(String, unique=True, index=True, nullable=False)
#     role = Column(String, nullable=False)
#     datejoined = Column(Date, nullable=False)

# Create Tables
print("🚀 Attempting to create tables in Supabase...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")

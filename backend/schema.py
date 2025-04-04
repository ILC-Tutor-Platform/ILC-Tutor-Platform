#   Description: This file contains the schema for the UserDetail model used for data serialization and validation for CRUD operations. 

from pydantic import BaseModel
from datetime import date

class UserDetailSchema(BaseModel):
    name: str
    email: str
    role: str
    datejoined: date

    class Config:
        from_attributes = True  

class AdminDetailSchema(BaseModel):
    admin_role: str

    class Config:
        from_attributes = True

class StudentDetailSchema(BaseModel):
    student_number: str
    interests: str
    degree_program: str

    class Config:
        from_attributes = True

class TutorDetailSchema(BaseModel):
    expertise: str
    subject_id: str
    availability: str
    description: str
    social_media_links: str
    status: str

    class Config:
        from_attributes = True

class StatusDetailSchema(BaseModel):
    status: str

    class Config:
        from_attributes = True

class SubjectDetailSchema(BaseModel):
    subject_name: str
    subject_description: str

    class Config:
        from_attributes = True
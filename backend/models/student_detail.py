from sqlalchemy import Column, Date, String, ForeignKey
from . import Base
from database import engine
from sqlalchemy.dialects.postgresql import UUID
import uuid

class StudentDetail(Base):
    __tablename__ = "student_detail"

    student_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, index=True)
    student_number = Column(String, unique=True, index=True, nullable=False)
    interests = Column(String, nullable=False)
    degree_program = Column(String, nullable=False)
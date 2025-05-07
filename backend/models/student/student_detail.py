from sqlalchemy import Column, String, ForeignKey
from models import Base
from sqlalchemy.dialects.postgresql import UUID

class StudentDetail(Base):
    __tablename__ = "student_detail"

    student_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True)
    student_number = Column(String, unique=True, index=True, nullable=False)
    degree_program = Column(String, nullable=False)
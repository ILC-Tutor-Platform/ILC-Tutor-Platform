from sqlalchemy import Column, UUID, ForeignKey
from models import Base
import uuid

class SessionStudents(Base):
    __tablename__ = "session_students"

    session_students_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("session.session_id"))
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_detail.student_id"))
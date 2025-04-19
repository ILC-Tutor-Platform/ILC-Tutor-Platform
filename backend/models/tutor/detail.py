from sqlalchemy import Column, String, ForeignKey, Integer
from models import Base
from sqlalchemy.dialects.postgresql import UUID

class TutorDetail(Base):
    __tablename__ = "tutor_detail"

    tutor_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True)
    description = Column(String, nullable=False)
    status = Column(Integer, ForeignKey("status_detail.status_id"))
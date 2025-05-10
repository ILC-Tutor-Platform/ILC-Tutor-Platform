from sqlalchemy import Column, String, ForeignKey, text
from models import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class SubjectDetail(Base):
    __tablename__ = "subject_detail"

    subject_id = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()"))
    subject_name = Column(String, nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), nullable=False)

    user = relationship("UserDetail", back_populates="subject_detail")
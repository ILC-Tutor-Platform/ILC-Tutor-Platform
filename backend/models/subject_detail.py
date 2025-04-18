from sqlalchemy import Column, Date, String, ForeignKey, text
from . import Base
from database import engine
from sqlalchemy.dialects.postgresql import UUID

class SubjectDetail(Base):
    __tablename__ = "subject_detail"

    subject_id = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()")) # added server_default="gen_random_uuid()" to auto generate a uuid
    subject_name = Column(String, nullable=False)
    subject_description = Column(String, unique=True, index=True, nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"), nullable=False)
from sqlalchemy import Column, String, ForeignKey, text
from models import Base
from sqlalchemy.dialects.postgresql import UUID

class SubjectDetail(Base):
    __tablename__ = "subject_detail"

    subject_id = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()")) # added server_default="gen_random_uuid()" to auto generate a uuid
    subject_name = Column(String, nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"), nullable=False)
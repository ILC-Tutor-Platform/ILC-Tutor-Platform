from sqlalchemy import Column, ForeignKey, String
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class TopicDetail(Base):
    __tablename__ = "topic_detail"

    topic_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subject_detail.subject_id"), nullable=False)
    topic_title = Column(String, nullable=True)
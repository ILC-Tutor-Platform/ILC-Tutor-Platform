from sqlalchemy import Column, ForeignKey, String
from . import Base
from sqlalchemy.dialects.postgresql import UUID

class TopicDetail(Base):
    __tablename__ = "topic_detail"

    topic_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subject_detail.subject_id"), nullable=False)
    topic_title = Column(String, nullable=False)
    topic_description = Column(String, nullable=False)
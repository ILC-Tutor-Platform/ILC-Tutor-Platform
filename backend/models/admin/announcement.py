from sqlalchemy import Column, ForeignKey
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Announcement(Base):
    __tablename__ = "announcement_detail"
    
    announcement_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4) 
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admin_detail.admin_id"), nullable=False)
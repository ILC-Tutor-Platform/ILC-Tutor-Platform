from sqlalchemy import Column, String, ForeignKey
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class AdminDetail(Base):
    __tablename__ = "admin_detail"

    admin_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, default=uuid.uuid4)
    admin_role = Column(String, nullable=False)
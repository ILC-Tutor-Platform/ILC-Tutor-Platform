from sqlalchemy import Column, Date, String, ForeignKey
from . import Base
from database import engine
from sqlalchemy.dialects.postgresql import UUID
import uuid

class AdminDetail(Base):
    __tablename__ = "admin_detail"

    admin_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, index=True)
    admin_role = Column(String, nullable=False)
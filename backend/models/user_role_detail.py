from sqlalchemy import Column, ForeignKey, Integer
from . import Base
from database import engine
from sqlalchemy.dialects.postgresql import UUID
import uuid

class UserRoleDetail(Base):
    __tablename__ = "user_role_detail"

    user_id = Column(UUID(as_uuid=True), ForeignKey("user_detail.userid"), primary_key=True, nullable=False)
    role_id = Column(Integer, ForeignKey("role_detail.role_id"), primary_key=True, nullable=False)
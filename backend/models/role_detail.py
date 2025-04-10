from sqlalchemy import Column, String, Integer
from . import Base
from database import engine

class RoleDetail(Base):
    __tablename__ = "role_detail"

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, nullable=False)
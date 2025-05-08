from sqlalchemy import Column, String, Integer
from models import Base

class RoleDetail(Base):
    __tablename__ = "role_detail"

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, nullable=False)
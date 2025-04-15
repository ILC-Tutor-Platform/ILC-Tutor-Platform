from sqlalchemy import Column, Date, String, Integer
from . import Base
from database import engine

class StatusDetail(Base):
    __tablename__ = "status_detail"

    status_id = Column(Integer, primary_key=True, index=True)
    status = Column(String, nullable=False)
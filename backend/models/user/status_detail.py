from sqlalchemy import Column, String, Integer
from models import Base

class StatusDetail(Base):
    __tablename__ = "status_detail"

    status_id = Column(Integer, primary_key=True)
    status = Column(String, nullable=False)
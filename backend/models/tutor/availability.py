from sqlalchemy import Column, ForeignKey, Date, Time
from models import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class TutorAvailability(Base):
    __tablename__ = "tutor_availability"

    tutor_availability_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_detail.tutor_id"), nullable=False)
    availability = Column(Date, nullable=False)
    available_time_from = Column(Time, nullable=False)
    available_time_to = Column(Time, nullable=False)

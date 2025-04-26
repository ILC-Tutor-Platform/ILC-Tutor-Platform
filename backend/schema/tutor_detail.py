from pydantic import BaseModel
from datetime import date, time
from typing import List
from uuid import UUID

class TutorDetailSchema(BaseModel):
    description: str
    status: str

    class Config:
        from_attributes = True

class TutorAffiliationSchema(BaseModel):
    affiliation: List[str]

    class Config:
        from_attributes = True

class TutorAvailabilitySchema(BaseModel):
    availability: List[date]
    available_time_from: List[time]
    available_time_to: List[time]

    class Config:
        from_attributes = True
        
class TutorExpertiseSchema(BaseModel):
    expertise: List[str]

    class Config:
        from_attributes = True

class TutorSocials(BaseModel):
    socials: List[str]
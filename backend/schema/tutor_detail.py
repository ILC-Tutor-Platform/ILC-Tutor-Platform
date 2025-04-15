from pydantic import BaseModel

class TutorDetailSchema(BaseModel):
    expertise: str
    subject_id: str
    availability: str
    description: str
    social_media_links: str
    status: str

    class Config:
        from_attributes = True
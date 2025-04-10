from pydantic import BaseModel

class SubjectDetailSchema(BaseModel):
    subject_name: str
    subject_description: str

    class Config:
        from_attributes = True
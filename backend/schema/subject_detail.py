from pydantic import BaseModel
from typing import List

class SubjectDetailSchema(BaseModel):
    subject_name: List[str]

    class Config:
        from_attributes = True
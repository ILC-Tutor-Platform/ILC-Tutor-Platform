from pydantic import BaseModel
from typing import Optional

class StudentDetailSchema(BaseModel):
    student_number: str
    degree_program: str

    class Config:
        from_attributes = True
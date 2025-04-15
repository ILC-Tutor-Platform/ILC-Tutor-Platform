from pydantic import BaseModel

class StudentDetailSchema(BaseModel):
    student_number: str
    interests: str
    degree_program: str

    class Config:
        from_attributes = True
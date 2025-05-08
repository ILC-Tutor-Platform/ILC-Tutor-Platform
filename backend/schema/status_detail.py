from pydantic import BaseModel

class StatusDetailSchema(BaseModel):
    status: str

    class Config:
        from_attributes = True
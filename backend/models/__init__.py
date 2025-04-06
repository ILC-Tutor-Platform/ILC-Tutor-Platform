from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .userdetail import UserDetail  # Import the UserDetail model to ensure it's registered with Base
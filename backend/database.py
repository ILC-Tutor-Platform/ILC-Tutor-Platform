# Description: This file contains the database connection and session creation logic.
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

# Initialize Metadata and Base
load_dotenv()

def db_connect():
    """Connect to the PostgreSQL database using environment variables."""

    DATABASE_URL = os.getenv("DATABASE_URL")


    # Create the database engine
    engine = create_engine(DATABASE_URL)

    return engine

engine = db_connect()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
    

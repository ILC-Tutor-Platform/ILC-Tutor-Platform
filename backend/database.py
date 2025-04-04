<<<<<<< HEAD
=======
# Description: This file contains the database connection and session creation logic.
>>>>>>> b00b3220b9d3be5f89f8d103acfb25a1748b195c
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

# Initialize Metadata and Base
load_dotenv()

def db_connect():
    """Connect to the PostgreSQL database using environment variables."""
<<<<<<< HEAD
    # Extract credentials
    username = os.getenv("DATABASE_USERNAME")
    password = os.getenv("DATABASE_PASSWORD")
    dbname = os.getenv("DATABASE_NAME")
    port = os.getenv("DATABASE_PORT", "5432")
    host = os.getenv("DATABASE_HOST")

    # Ensure all required values are present
    if not all([username, password, dbname, host]):
        raise ValueError("Missing database credentials in .env file.")

    # Create the database engine
    engine = create_engine(f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{dbname}?sslmode=require", echo=True)
=======

    DATABASE_URL = os.getenv("DATABASE_URL")


    # Create the database engine
    engine = create_engine(DATABASE_URL)
>>>>>>> b00b3220b9d3be5f89f8d103acfb25a1748b195c

    return engine

engine = db_connect()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
<<<<<<< HEAD

# def create_tables(engine):
#     """Drop and create tables using raw metadata."""
#     Base.metadata.drop_all(engine, checkfirst=True)
#     Base.metadata.create_all(engine, checkfirst=True)
=======
>>>>>>> b00b3220b9d3be5f89f8d103acfb25a1748b195c
    

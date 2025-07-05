from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load .env file if it exists, otherwise continue without it
try:
    load_dotenv()
except Exception:
    # If .env file doesn't exist or can't be loaded, continue without it
    pass

# Get DATABASE_URL from environment variable (set in docker-compose)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 
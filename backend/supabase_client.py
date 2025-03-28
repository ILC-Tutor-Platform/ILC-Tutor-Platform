# Description: This file initializes the supabase client using the credentials fetched from the .env file.
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# load environment variables from .env
load_dotenv()

# Fetch credentials from .env file
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY")

# Initialize supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
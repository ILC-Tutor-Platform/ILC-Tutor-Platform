# Description: This file initializes the supabase client using the credentials fetched from the .env file.
from supabase import create_client, Client
from dotenv import load_dotenv
from config import get_secret

secrets = get_secret()

# Fetch credentials from .env file
SUPABASE_URL = secrets.get("SUPABASE_URL")
SUPABASE_KEY = secrets.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY")

# Initialize supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Description: This file initializes the supabase client using the credentials fetched from the .env file.
from supabase import create_client, Client
from . import settings

SETTINGS = settings.get_settings()

# Initialize supabase client
supabase: Client = create_client(
    SETTINGS.SUPABASE_URL, 
    SETTINGS.SUPABASE_KEY)

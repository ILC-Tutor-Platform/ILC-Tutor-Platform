import psycopg2
import os

DATABASE_URL = os.getenv("SUPABASE_URL")  # Ensure this is set correctly

try:
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Connected to Supabase successfully!")
    conn.close()
except Exception as e:
    print("❌ Failed to connect:", e)

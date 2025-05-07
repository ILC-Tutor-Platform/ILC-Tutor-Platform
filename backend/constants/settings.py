import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    STAGE: str = os.getenv("ENV", "development")
    SUPABASE_URL: str
    SUPABASE_KEY: str
    DATABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_JWT_SECRET: str    

    model_config = SettingsConfigDict(env_file=f".env.{STAGE}" if os.path.exists(f".env.{STAGE}") else ".env")
    
@lru_cache
def get_settings() -> Settings:
    return Settings()
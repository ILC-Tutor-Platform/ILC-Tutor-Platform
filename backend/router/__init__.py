# Initializes auth and user routers
from .user import router as user
from .auth import router as auth

__all__ = ["user", "auth"]

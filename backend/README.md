# Backend

## Tech Stack
FastAPI\
Supabase\
SQLAlchemy\
uvicorn\
psycopg2\
python-dotenv

### LOGS
04/04/2025\
For this branch (```10-be-user-role-system```), I have added the following features:
- Added a new model for AdminDetail, StudentDetail, TutorDetail, StatusDetail, SubjectDetail to store specific information.
- Used UUID for primary keys in all models.
- Added server_default=text("gen_random_uuid()") to auto-generate UUIDs for primary keys.
- Used ForeignKey() relationships to link models together where necessary.

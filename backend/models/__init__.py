from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .admin_detail import AdminDetail
from .role_detail import RoleDetail
from .status_detail import StatusDetail
from .student_detail import StudentDetail
from .subject_detail import SubjectDetail
from .tutor_detail import TutorDetail
from .user_detail import UserDetail
from .user_role_detail import UserRoleDetail
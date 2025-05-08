from pydantic import BaseModel
from datetime import date

from .admin_detail import AdminDetailSchema
from .role_detail import RoleDetailSchema
from .status_detail import StatusDetailSchema
from .student_detail import StudentDetailSchema
from .subject_detail import SubjectDetailSchema
from .tutor_detail import TutorDetailSchema, TutorAvailabilitySchema, TutorAffiliationSchema, TutorExpertiseSchema, TutorSocials
from .user_detail import UserDetailSchema
from .user_role_detail import UserRoleDetailSchema
from .user_signup import StudentSignupSchema, TutorSignupSchema
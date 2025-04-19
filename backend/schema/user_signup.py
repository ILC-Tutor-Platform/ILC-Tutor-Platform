from . import BaseModel, UserDetailSchema, StudentDetailSchema, TutorDetailSchema, TutorAvailabilitySchema, TutorAffiliationSchema, TutorExpertiseSchema, TutorSocials

class StudentSignupSchema(BaseModel):
    user: UserDetailSchema
    student: StudentDetailSchema

class TutorSignupSchema(BaseModel):
    user: UserDetailSchema
    tutor: TutorDetailSchema
    availability: TutorAvailabilitySchema
    affiliation: TutorAffiliationSchema
    expertise: TutorExpertiseSchema
    socials: TutorSocials

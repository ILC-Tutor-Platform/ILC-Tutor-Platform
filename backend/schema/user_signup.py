from . import BaseModel, UserDetailSchema, StudentDetailSchema, TutorDetailSchema, TutorAvailabilitySchema, TutorAffiliationSchema, TutorExpertiseSchema, TutorSocials, SubjectDetailSchema

class StudentSignupSchema(BaseModel):
    user: UserDetailSchema
    student: StudentDetailSchema

class TutorSignupSchema(BaseModel):
    user: UserDetailSchema
    tutor: TutorDetailSchema
    subject: SubjectDetailSchema
    availability: TutorAvailabilitySchema
    affiliation: TutorAffiliationSchema
    expertise: TutorExpertiseSchema
    socials: TutorSocials

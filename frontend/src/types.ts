export interface StudentSignUp {
  user: {
    name: string;
    email: string;
    password: string;
    datejoined: string;
  };
  student: {
    student_number: string;
    degree_program: string;
  };
}

export interface UserPayload {
  uid?: string;
  name?: string;
  role?: number[];
  email?: string;
}

export interface TutorSignUp {
  user: {
    name: string;
    email: string;
    password: string;
    datejoined: string;
  };
  tutor: {
    description: string;
    status: string;
  };
  availability: {
    availability: string[];
    available_time_from: string[];
    available_time_to: string[];
  };
  affiliation: {
    affiliation: string[];
  };
  expertise: {
    expertise: string[];
  };
  socials: {
    socials: string[];
  };
  subject: {
    subject_name: string[];
  };
}

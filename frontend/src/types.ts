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

export interface TutorDetail {
  userid: string;
  name: string;
  email: string;
  datejoined: string;
  description: string;
  status: string;
  affiliations: string[];
  availability: string[];
  available_time_from: string[];
  available_time_to: string[];
  expertise: string[];
  socials: string[];
}

export interface StudentDetail {
  userid: string;
  name: string;
  email: string;
  password: string;
  datejoined: string;
  student_number: string;
  degree_program: string;
}

export interface TutorResponse {
  tutors: TutorDetail[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentResponse {
  name: string, 
  subject: string, 
  topic: string, 
  date: Date,
  time: string,
  session_id: string
}

export interface Schedule {
  name: string;
  date: Date,
  topic: string,
  time: string,
  subject: string;
  status_id: number
}
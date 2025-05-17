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
  subject: string;
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
  name: string;
  subject: string;
  topic: string;
  date: Date;
  time: string;
  session_id: string;
}

export interface Schedule {
  name: string;
  date: Date;
  topic: string;
  time: string;
  subject: string;
  status_id: number;
}

export interface StudentResponse {
  name: string;
  subject: string;
  topic: string;
  date: Date;
  time: string;
  session_id: string;
}

export interface Schedule {
  name: string;
  date: Date;
  topic: string;
  time: string;
  subject: string;
  status: number;
}

export interface StudentResponse {
  name: string;
  subject: string;
  topic: string;
  date: Date;
  time: string;
  session_id: string;
}

export interface Schedule {
  name: string;
  subject: string;
  topic: string;
  date: Date;
  time: string;
  status_id: number;
  session_id: string;
}

export interface AdminSessionTracking {
  tutor_name: string;
  student_name: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  session_id: string;
  status_id: number;
}

export interface TutorRequests {
  tutor_name: string;
  email: string;
  description: string;
  status_id: number;
  subject: string;
  expertise: string;
  tutor_id: string;
}

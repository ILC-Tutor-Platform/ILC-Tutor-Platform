
export interface StudentSignUp {
    user: {
        name: string;
        email: string;
        password: string;
        datejoined: string;
    }
    student: {
        student_number: string;
        degree_program: string;
    }
}

export interface UserPayload {
    uid: string;
    name: string;
    role: number[];
}

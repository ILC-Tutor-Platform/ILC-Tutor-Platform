
export interface StudentSignUp {
    user: {
        name: string;
        email: string;
        password: string;
        dateJoined: string;
    }
    student: {
        student_number: string;
        degree_program: string;
    }
}
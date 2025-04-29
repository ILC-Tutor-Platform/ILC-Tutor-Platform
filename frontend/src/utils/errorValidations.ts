export const isValidStudentNumber = (studentNumber: string) => {
  const studentNumberPattern = /^\d{4}-\d{5}$/;
  return studentNumberPattern.test(studentNumber);
};

export const isValidUpEmail = (email: string) => {
  const validUPmailPattern = /^[a-zA-Z0-9._%+-]+@up\.edu\.ph$/;
  return validUPmailPattern.test(email);
};

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  isValidStudentNumber,
  isValidUpEmail,
} from "@/utils/errorValidations.ts";
import DropdownDegreeProgram from "@/components/DropdownDegreeProgram.tsx";
import { Label } from "@/components/ui/label";

const SignUpAsStudent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const concatenatedName = `${firstName} ${lastName} ${middleInitial}`;

  const dateNow = () => {
    const date = new Date().toISOString().split("T")[0];
    return date;
  };
  const validateFields = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "*Required";
    if (!lastName.trim()) newErrors.lastName = "*Required";
    if (!studentNumber.trim()) {
      newErrors.studentNumber = "*Required";
    } else if (!isValidStudentNumber(studentNumber)) {
      newErrors.studentNumber = "*Student number must be in format YYYY-12345.";
    }
    if (!email.trim()) {
      newErrors.email = "*Required";
    } else if (!isValidUpEmail(email)) {
      newErrors.email = "*Must be a valid UP Email.";
    }
    if (!password.trim()) {
      newErrors.password = "*Required";
    } else if (password.length < 8) {
      newErrors.password = "*Password must be at least 8 characters long.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const navigate = useNavigate();

  // placeholder for the sign up as student function
  const signUpAsStudentHandler = async () => {
    setLoading(true);
    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const signUpData = {
        user: {
          name: concatenatedName,
          email: email,
          password: password,
          datejoined: dateNow(),
          student: {
            student_number: studentNumber,
            degree_program: selectedProgram,
          },
        },
      };

      console.log(signUpData);
      navigate("/verify-email");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signUpAsStudentHandler();
        }}
        className="grid w-[90%] xl:w-[30%] mx-auto py-15 px-4 xl:px-10 gap-10 rounded-2xl green-shadow-card"
      >
        <div className="grid gap-10">
          <img src={Logo} alt="Logo" className="w-35 h-auto mx-auto" />
          <h2 className="font-bold text-5xl xl:text-6xl text-center">
            Sign Up
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid">
            <div className="flex gap-2">
              <div className="flex flex-col w-full">
                <span className="h-7 font-thin text-[0.8rem] text-red-500">
                  {errors.firstName && "*First name is required."}
                </span>
                <Input
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-3 mt-2"
                  type="text"
                  name="setFirstName"
                  id="setFirstName"
                  placeholder="First Name"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="h-7 font-thin text-[0.8rem] text-red-500">
                  {errors.lastName && "*Last name is required."}
                </span>
                <Input
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-3 mt-2"
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                />
              </div>
              <div className="flex flex-col w-1/4">
                <span className="h-7 font-thin text-sm text-red-500">
                  {errors.middleInitial && "Required"}
                </span>
                <Input
                  onChange={(e) => setMiddleInitial(e.target.value)}
                  className="p-3 mt-2"
                  type="text"
                  name="middleInitial"
                  id="middleInitial"
                  placeholder="M.I."
                />
              </div>
            </div>
          </div>

          <div>
            {errors.studentNumber && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.studentNumber}
              </Label>
            )}
            <Input
              onChange={(e) => setStudentNumber(e.target.value)}
              className="p-3 mt-2"
              type="text"
              name="studentNumber"
              id="studentNumber"
              placeholder="Student Number"
            />
          </div>
          <div>
            <DropdownDegreeProgram
              selectedProgram={selectedProgram}
              onSelectProgram={setSelectedProgram}
            />
          </div>

          <div>
            {errors.email && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.email}
              </Label>
            )}
            <Input
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 mt-2"
              type="email"
              name="email"
              id="email"
              placeholder="UP Mail"
              autoComplete="email"
            />
          </div>

          <div>
            {errors.password && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.password}
              </Label>
            )}
            <Input
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 mt-2"
              type="password"
              name="password"
              id="password"
              placeholder="Create Password"
              autoComplete="password"
            />
          </div>
        </div>
        <div className="flex items-center w-[50%] mx-auto">
          <Button
            variant={"yellow-button"}
            type="submit"
            className="w-full"
            disabled={loading}
          >
            Sign up as Student
          </Button>
        </div>
        <div className="flex items-center justify-center gap-1 text-ilc-grey">
          <p>Already have an account? </p>
          <Link to="/signin" className="font-bold text-black">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpAsStudent;

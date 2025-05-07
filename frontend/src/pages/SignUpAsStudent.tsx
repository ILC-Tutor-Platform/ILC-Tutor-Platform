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
import { UserAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SignUpAsStudent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authContext = UserAuth();
  const { signUpStudent } = authContext || {};
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const concatenatedName = `${firstName} ${lastName} ${middleInitial}`;

  const dateNow = () => {
    const date = new Date().toISOString().split("T")[0];
    return date;
  };
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

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
    if (!selectedProgram?.trim()) {
      newErrors.degreeProgram = "*Degree Program is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const signUpAsStudentHandler = async () => {
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    if (!signUpStudent) {
      console.error("signUpStudent function not found in AuthContext");
      setLoading(false);
      return;
    }

    const payload = {
      user: {
        name: concatenatedName,
        email,
        password,
        datejoined: dateNow(),
      },
      student: {
        student_number: studentNumber,
        degree_program: selectedProgram || "",
      },
    };

    const { success, error } = await signUpStudent(payload);

    if (success) {
      console.log("User signed up successfully:", concatenatedName);
      navigate("/signin");
      // Show success toast
      toast.success(
        "Please check your email. We sent you a confirmation. Thank you.",
        {
          className: "green-shadow-card text-black",
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#307B74",
            fontSize: "16px",
            border: "0px",
            padding: "1.5rem",
            boxShadow: "0px 4px 4px 3px rgba(48, 123, 116, 0.40)",
          },
        }
      );
      setLoading(false);
    } else {
      setErrors({ general: error || "Signup failed" });
      setLoading(false);
      return;
    }

    setLoading(false);
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
                <Label>First Name*</Label>
                <Input
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`p-3 mt-2 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  type="text"
                  name="setFirstName"
                  id="setFirstName"
                  placeholder="First Name"
                />
                <span className="h-7 font-thin text-[0.8rem] text-red-500">
                  {errors.firstName && "*First name is required."}
                </span>
              </div>
              <div className="flex flex-col w-full">
                <Label>Last Name*</Label>
                <Input
                  onChange={(e) => setLastName(e.target.value)}
                  className={`p-3 mt-2 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                />
                <span className="h-7 font-thin text-[0.8rem] text-red-500">
                  {errors.lastName && "*Last name is required."}
                </span>
              </div>
              <div className="flex flex-col w-1/3">
                <Label>M.I.*</Label>
                <Input
                  onChange={(e) => setMiddleInitial(e.target.value)}
                  className="p-3 mt-2"
                  type="text"
                  name="middleInitial"
                  id="middleInitial"
                  placeholder="M.I."
                />
                <span className="h-7 font-thin text-sm text-red-500">
                  {errors.middleInitial && "Required"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label>Student Number*</Label>
            <Input
              onChange={(e) => setStudentNumber(e.target.value)}
              className={`p-3 mt-2 ${
                errors.studentNumber ? "border-red-500" : ""
              }`}
              type="text"
              name="studentNumber"
              id="studentNumber"
              placeholder="Student Number"
            />
            {errors.studentNumber && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.studentNumber}
              </Label>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Degree Program*</Label>
            <DropdownDegreeProgram
              selectedProgram={selectedProgram}
              onSelectProgram={setSelectedProgram}
              className={`p-3 mt-2 ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.studentNumber && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.studentNumber}
              </Label>
            )}
          </div>

          <div>
            <Label>Email Address*</Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              className={`p-3 mt-2 ${errors.email ? "border-red-500" : ""}`}
              type="email"
              name="email"
              id="email"
              placeholder="UP Mail"
              autoComplete="email"
            />
            {errors.email && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.email}
              </Label>
            )}
          </div>

          <div>
            <Label>Create Password*</Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              className={`p-3 mt-2 ${errors.password ? "border-red-500" : ""}`}
              type={showPassword ? "text" : "password"} // Controlled by state!
              name="password"
              id="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            {errors.password && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.password}
              </Label>
            )}

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={handleShowPassword}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-ilc-grey">
                Show Password
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center w-[50%] mx-auto">
          <Button
            variant={"yellow-button"}
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up as a Student"}
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

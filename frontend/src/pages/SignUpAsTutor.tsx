import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { Link, useNavigate } from "react-router-dom";

const SignUpAsStudent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [expertise, setExpertise] = useState("");
  const [affiliations, setAffiliations] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const role = "tutor";
  const navigate = useNavigate();

  // placeholder for the sign up as tutor function
  const signUpAsTutorHandler = async () => {
    if (
      !firstName ||
      !lastName ||
      !expertise ||
      !affiliations ||
      !email ||
      !password
    ) {
      console.error("Please fill in all the fields!");
      window.alert("Please fill in all the fields!");
      return;
    }
    const signUpData = {
      firstName,
      lastName,
      middleInitial,
      expertise,
      affiliations,
      email,
      password,
      role,
    };
    console.log(signUpData);
    navigate("/verify-email");
  };

  return (
    <div className="flex min-h-screen items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signUpAsTutorHandler();
        }}
        className="grid w-[90%] xl:w-[30%] mx-auto py-15 px-4 xl:px-10 gap-10 rounded-2xl green-shadow-card"
      >
        <div className="grid gap-10">
          <img src={Logo} alt="Logo" className="w-35 h-auto mx-auto" />
          <h2 className="font-bold text-5xl xl:text-6xl text-center">
            Sign Up
          </h2>
        </div>

        <div className="grid gap-4">
          <div
            className="grid grid-cols-3 gap-4"
            style={{ gridTemplateColumns: "1fr 1fr 20%" }}
          >
            <Input
              onChange={(e) => setFirstName(e.target.value)}
              className="p-3 mt-2"
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              autoComplete="given-name"
            />
            <Input
              onChange={(e) => setLastName(e.target.value)}
              className="p-3 mt-2"
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              autoComplete="family-name"
            />
            <Input
              onChange={(e) => setMiddleInitial(e.target.value)}
              className="p-3 mt-2"
              type="text"
              name="middleInitial"
              id="middleInitial"
              placeholder="M.I."
              autoComplete="additional-name"
            />
          </div>

          <Input
            onChange={(e) => setExpertise(e.target.value)}
            className="p-3 mt-2"
            type="text"
            name="expertise"
            id="expertise"
            placeholder="Expertise"
          />

          <Input
            onChange={(e) => setAffiliations(e.target.value)}
            className="p-3 mt-2"
            type="text"
            name="affiliations"
            id="affiliations"
            placeholder="Affiliations"
          />

          <Input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-2"
            type="email"
            name="email"
            id="email"
            placeholder="UP Mail"
            autoComplete="email"
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mt-2"
            type="password"
            name="password"
            id="password"
            placeholder="Create password"
            autoComplete="password"
          />
        </div>
        <div className="flex items-center w-[50%] mx-auto">
          <Button variant={"yellow-button"} type="submit" className="w-full">
            Sign up as Tutor
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

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { Link, useNavigate } from "react-router-dom";

/*
todo 1

user: {
name, email, password, datejoined
}
tutor: {
description, status (make a dropdown for status)
}
availability: {
availability: [date, available_time_from, available_time_to]
}
affiliation: {affiliation: [affiliation_name]}
expertise: {
exoertise: [expertise]
}
socials: {
socials: [socials]
}
*/

/*
todo 2
form validation:
  - empty fields
  - up email
  - password
*/

const SignUpAsStudent = () => {
  const navigate = useNavigate();
  const signUpAsTutorHandler = async () => {
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

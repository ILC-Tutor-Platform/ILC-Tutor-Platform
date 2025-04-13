import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { Link } from "react-router-dom";

const SignUpAs = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen items-center">
      <div className="flex flex-col gap-15 w-[30%] mx-auto py-15 px-10 rounded-2xl green-shadow-card">
        <div className="grid gap-10">
          <img src={Logo} alt="Logo" className="w-35 h-auto mx-auto" />
          <h2 className="font-bold text-6xl text-center">Sign Up</h2>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex justify-evenly">
            <Button onClick={() => navigate("/signup/student")} variant={'yellow-button'}>
              Sign up as Student
            </Button>
            <Button onClick={() => navigate("/signup/tutor")} variant={'yellow-button'}>
              Sign up as Tutor
            </Button>
          </div>

          <div className="text-center flex justify-center gap-2">
            <p>Already have an account?</p>
            <Link to="/signin" className="font-bold">
              Log in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpAs;

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import Logo from "@/assets/AralLinkLogo.svg";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "@/components/ui/label";
import { isValidUpEmail } from "@/utils/errorValidations.ts";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const navigate = useNavigate();

  const authContext = UserAuth();
  const { session, signInUser } = authContext || {};

  const validateFields = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "*Email is required.";
    } else if (!isValidUpEmail(email)) {
      newErrors.email = "*Must be a valid UP email.";
    }
    if (!password.trim()) newErrors.password = "*Password is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (session) {
      console.log(session); // Log session only when it changes
    }
  }, [session]); // Runs only when session changes

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const signInData = {
        email,
        password,
      };
      console.log(signInData);

      if (isStudent) {
        navigate("/profile/student");
      } else {
        navigate("/profile/tutor");
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center w-full">
      <form
        onSubmit={handleSignIn}
        className="flex flex-col w-[90%] md:gap-15 xl:w-[30%] mx-auto py-7 md:px-10 rounded-2xl green-shadow-card"
      >
        <div className="grid gap-10">
          <img src={Logo} alt="Logo" className="w-35 h-auto mx-auto" />
          <h2 className="font-bold text-5xl text-center">Sign in</h2>
        </div>

        <div className="flex flex-col gap-8 p-8">
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              {errors.email && (
                <Label className="text-[0.8rem] font-thin text-red-500">
                  {errors.email}
                </Label>
              )}
              <Input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
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
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              type="submit"
              disabled={loading}
              variant={"yellow-button"}
              onClick={() => setIsStudent(true)}
            >
              Sign in as Student
            </Button>

            <Button
              type="submit"
              disabled={loading}
              variant={"yellow-button"}
              onClick={() => setIsStudent(false)}
            >
              Sign in as Tutor
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1 text-ilc-grey">
            <p>Don't have an account? </p>
            <Link to="/signup" className="font-bold text-black">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signin;

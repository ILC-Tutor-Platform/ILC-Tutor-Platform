import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import Logo from "@/assets/AralLinkLogo.svg";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "@/components/ui/label";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const [isEmptyEmailField, setEmptyEmailField] = useState(false);
  const [isEmptyPasswordField, setEmptyPasswordField] = useState(false);
  const navigate = useNavigate();

  const authContext = UserAuth();
  const { session, signInUser } = authContext || {};

  useEffect(() => {
    if (session) {
      console.log(session); // Log session only when it changes
    }
  }, [session]); // Runs only when session changes

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      setEmptyEmailField(true);
      console.error("Email is required.");
      setLoading(false);
      return;
    }

    if (!password) {
      setEmptyPasswordField(true);
      console.error("Password is required.");
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
          <div className="grid gap-4">
            {isEmptyEmailField ? (
              <>
                <Label htmlFor="email" className="font-thin text-red-500">
                  Email Address is Required
                </Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  autoComplete="email"
                />
              </>
            ) : (
              <>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  autoComplete="email"
                />
              </>
            )}

            {isEmptyPasswordField ? (
              <>
                <Label htmlFor="password" className="font-thin text-red-500">
                  Password is Required
                </Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 mt-2"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </>
            ) : (
              <>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 mt-2"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </>
            )}
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

          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Signin;

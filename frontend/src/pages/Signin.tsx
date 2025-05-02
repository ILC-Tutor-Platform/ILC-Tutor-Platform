import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Logo from "@/assets/AralLinkLogo.svg";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "@/components/ui/label";
import { isValidUpEmail } from "@/utils/errorValidations.ts";
import SessionLoading from "@/components/Loading";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    invalidCredentials?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const authContext = UserAuth();
  const { signInUser } = authContext || {};

  // No need to manually query the DOM!
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateFields = () => {
    const newErrors: {
      email?: string;
      password?: string;
      invalidCredentials?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = "*Email is required.";
    } else if (!isValidUpEmail(email)) {
      newErrors.email = "*Must be a valid UP email.";
    }
    if (!password.trim()) newErrors.password = "*Password is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const { success, error } = await signInUser(email, password);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (success) {
        navigate(isStudent ? "/profile/student" : "/profile/tutor");
      } else {
        setErrors({
          invalidCredentials: error,
        });
        console.error("Sign in failed:", error);
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <SessionLoading msg="Signing in" />
        </div>
      ) : (
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
                {errors.invalidCredentials && (
                  <Label className="text-red-500 mx-auto">
                    {errors.invalidCredentials}
                  </Label>
                )}

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
                    type={showPassword ? "text" : "password"} // Controlled by state!
                    name="password"
                    id="password"
                    placeholder="Password"
                    autoComplete="current-password"
                  />

                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="showPassword"
                      checked={showPassword}
                      onChange={handleShowPassword}
                      className="mr-2"
                    />
                    <label
                      htmlFor="showPassword"
                      className="text-sm text-ilc-grey"
                    >
                      Show Password
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  disabled={loading}
                  variant={"yellow-button"}
                  onClick={() => setIsStudent(true)}
                >
                  Sign in as Student
                </Button>

                <Button
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
              <div className="mx-auto">
                <Link
                  to={"/"}
                  className="font-light text-ilc-grey hover:text-black transition-all duration-300"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Signin;

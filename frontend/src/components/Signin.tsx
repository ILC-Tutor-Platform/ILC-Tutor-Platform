import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Logo from "@/assets/AralLinkLogo.svg";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const authContext = UserAuth();
  const { session, signInUser } = authContext || {};
  console.log(session);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    try {
      const result = await signInUser(email, password);

      // Check if signup was successful
      if (result.success) {
        navigate("/dashboard");
      } else {
        // Handle known error from result
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      // Handle unexpected errors
      console.error("Sign up error:", err); // Log for debugging purposes
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false); // End loading state, regardless of success or failure
    }
  };

  return (
    <div className="flex h-screen items-center w-full">
      <form
        onSubmit={handleSignIn}
        className="flex flex-col gap-15 w-[30%] mx-auto py-15 px-10 rounded-2xl green-shadow-card"
      >
        <div className="grid gap-10">
          <img src={Logo} alt="Logo" className="w-35 h-auto mx-auto" />
          <h2 className="font-bold text-6xl text-center">Sign in</h2>
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid gap-4">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
            />

            <Input
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 mt-2"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
          </div>

          <div className="flex gap-8 justify-center">
            <Button type="submit" disabled={loading} variant={"yellow-button"}>
              Sign in as Student
            </Button>

            <Button type="submit" disabled={loading} variant={"yellow-button"}>
              Sign in as Tutor
            </Button>
          </div>

          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold">
              Sign up
            </Link>
          </p>

          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Signin;

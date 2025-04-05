import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext'; 

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const authContext = UserAuth();
    const {session, signInUser } = authContext || {};
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
        <div>
          <form onSubmit={handleSignIn} className="max-w-md m-auto pt-24">
            <h2 className="font-bold pb-2">Sign in</h2>
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            <div className="flex flex-col py-4">
              {/* <label htmlFor="Email">Email</label> */}
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 mt-2"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col py-4">
              {/* <label htmlFor="Password">Password</label> */}
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 mt-2"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full mt-4">
              Sign In
            </button>
            {error && <p className="text-red-600 text-center pt-4">{error}</p>}
          </form>
        </div>
      );
    };
    
export default Signin;
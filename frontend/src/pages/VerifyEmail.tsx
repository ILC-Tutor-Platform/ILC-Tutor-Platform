import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/utils/axios";

const VerifyEmail = () => {
  const email = useAuthStore((state) => state.user?.email);
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("pending"); // "pending", "success", "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email) {
        console.warn("No email found in store. Cannot verify.");
        setVerificationStatus("error");
        setErrorMessage("No email found. Please sign in again.");
        setTimeout(() => navigate("/signin"), 3000);
        return;
      }

      try {
        console.log("Attempting to verify email:", email);

        // Make the API call with more detailed logging
        const response = await api.post("/auth/verify-email", { email });
        console.log("Email verification response:", response.data);

        if (response.data.message.includes("not yet verified")) {
          setVerificationStatus("pending");
        } else {
          setVerificationStatus("success");
        }
      } catch (error) {
        setVerificationStatus("error");

        // Extract detailed error information
        let message = "Unknown error occurred";
        if (error.response) {
          message =
            error.response.data?.detail ||
            `Server error (${error.response.status})`;
          console.error("Server responded with error:", {
            status: error.response.status,
            data: error.response.data,
          });
        } else if (error.request) {
          message = "No response received from server";
          console.error("No response received:", error.request);
        } else {
          message = error.message || "Error processing request";
          console.error("Error setting up request:", error.message);
        }

        setErrorMessage(message);

        // Wait a bit before redirecting to give user time to see error
        setTimeout(() => navigate("/signin"), 5000);
      }
    };

    verifyEmail();
  }, [email, navigate]);

  return (
    <section className="grid justify-center min-h-screen w-full">
      <div className="w-[80%] mx-auto max-w-lg mt-16 p-6 border rounded-lg shadow-md h-[50%]">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Email Verification
        </h1>

        {verificationStatus === "pending" && (
          <div className="text-center">
            <p className="mb-4">We're verifying your email address...</p>
            <p className="text-sm text-gray-600">
              If you haven't received a verification email, please check your
              spam folder. You need to click the verification link in the email
              before proceeding.
            </p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Your email has been successfully verified!
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Proceed to Sign In
            </button>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="text-center">
            <p className="text-red-600 mb-2">
              There was a problem verifying your email.
            </p>
            <p className="text-sm mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-600">
              Redirecting to sign in page...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VerifyEmail;

import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const verifyEmail = async () => {
    console.log(
      "Call /verify-email api endpoint to trigger the function to add the user metadata to public.users table. <3",
    );
  };

  const reload = async () => {
    window.location.reload();
  };

  verifyEmail();
  return (
    <section className="grid justify-center min-h-screen w-full">
      <div className="w-[80%] mx-auto">
        <h1>Verify Email</h1>
        <p>Please check your email to verify your account.</p>
        <p>
          If you didn't receive an email, please check your spam folder or try
          resending the verification email.
        </p>
        <Button onClick={reload}>Resend Verification Email</Button>
      </div>
    </section>
  );
};
export default VerifyEmail;

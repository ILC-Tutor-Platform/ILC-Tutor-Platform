import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRoleStore } from "@/stores/roleStore";
import logo from "../assets/AralLinkLogo.svg";

const roleLabels: Record<number, string> = {
  0: "Student",
  1: "Tutor",
  2: "Admin",
};

const ChooseRole = () => {
  const navigate = useNavigate();
  const { roles, setActiveRole } = useRoleStore();

  const handleRoleSelection = (role: number) => {
    setActiveRole(role);
    console.log("Role selected: ", roles);
    navigate(`/profile/${roleLabels[role]?.toLowerCase()}`);
  };

  if (!roles.length) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>No roles found. Please contact support or re-login.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center min-h-screen justify-center">
      <div className="flex flex-col gap-10 text-center green-shadow-card py-[3rem] rounded-2xl w-[90%] md:w-[50%] lg:w-[30%] 2xl:w-[20%] px-5">
        <img src={logo} alt="Logo" className="w-35 h-auto mx-auto" />
        <h1 className="text-2xl font-bold">
          We noticed you have multiple roles.
        </h1>
        <h2 className="text-md">Select which role you want to sign in to:</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {[...roles]
            .sort((a, b) => a - b)
            .map((role) => (
              <Button
                key={role}
                variant={"yellow-button"}
                onClick={() => handleRoleSelection(role)}
              >
                Sign in as {roleLabels[role] ?? "Unknown"}
              </Button>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseRole;

import { Navigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { useRoleStore } from "@/stores/roleStore";
import { JSX } from "react";
import { toast } from "sonner";

interface Props {
  children: JSX.Element;
  allowedRoles: number[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = UserAuth();
  const { activeRole } = useRoleStore();

  if (!user || !user.user_metadata) {
    console.log("No user session found. Redirecting to /signin...");
    return <Navigate to="/signin" />;
  }

  // Still haven't selected a role yet
  if (activeRole === null) {
    console.log("No active role set. Redirecting to /choose-role...");
    return <Navigate to="/choose-role" />;
  }

  const hasAccess = allowedRoles.includes(activeRole);

  if (!hasAccess) {
    const fallback =
      activeRole === 0 ? "student" : activeRole === 1 ? "tutor" : "admin";
    toast.error("You don't have access to this page. Redirecting...", {
      duration: 3000,
      style: {
        backgroundColor: "#ffffff",
        color: "#8A1538",
        fontSize: "16px",
      },
    });
    return <Navigate to={`/profile/${fallback}`} />;
  }

  return children;
};

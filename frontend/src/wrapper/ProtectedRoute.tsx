import { Navigate } from "react-router-dom"
import { UserAuth } from "@/context/AuthContext"
import { JSX } from "react";
import { toast } from "sonner"

interface Props {
    children: JSX.Element;
    allowedRoles: number[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const { user } = UserAuth();
  
    let rolesRaw = user?.user_metadata?.role;
    const roles: number[] = Array.isArray(rolesRaw)
      ? rolesRaw.map(Number)
      : [Number(rolesRaw)].filter((n) => !isNaN(n));
  
    const hasAccess = roles.some((role: number) => allowedRoles.includes(role));
  
    if (!user || !user.user_metadata) {
      return (
        console.log("No user session found. Redirecting ..."),
        <Navigate to="/signin" />
      );
    }
    if (!hasAccess) {
      toast.error("You don't have an account associated with this role. Redirecting", {
        duration: 3000,
        style: {
          backgroundColor: "#ffffff",
          color: "#8A1538",
          fontSize: "16px",
        },
      });
      return <Navigate to="/" />;
    }
  
    return children;
  };
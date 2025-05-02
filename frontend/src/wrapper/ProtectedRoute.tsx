import { Navigate } from "react-router-dom"
import { UserAuth } from "@/context/AuthContext"
import { JSX } from "react";

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
    if (!hasAccess) return (
      window.alert("You do not have permission to access this page. Redirecting ..."),
      <Navigate to="/" />
    );
  
    return children;
  };
  
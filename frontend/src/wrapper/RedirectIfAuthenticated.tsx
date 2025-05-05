import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useRoleStore } from "../stores/roleStore";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const RedirectIfAuthenticated = ({ children }: Props) => {
  const { session } = UserAuth();
  const activeRole = useRoleStore((state) => state.activeRole);

  if (session) {
    if (activeRole === 0) return <Navigate to="/profile/student" replace />;
    if (activeRole === 1) return <Navigate to="/profile/tutor" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;

import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useRoleStore } from "../stores/roleStore";
import { ReactNode, useState, useEffect } from "react";
import SessionLoading from "../components/Loading";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: number[];
  redirectTo?: string;
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/signin",
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = UserAuth();
  const activeRole = useRoleStore((state) => state.activeRole);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return <SessionLoading msg="Verifying access..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0) {
    if (activeRole !== null && activeRole !== undefined) {
      if (!allowedRoles.includes(activeRole)) {
        return <Navigate to="/" replace />;
      }
    } else {
      const userRoles = (user.role ?? []).map((r) =>
        typeof r === "string" ? parseInt(r) : r,
      );

      const hasAllowedRole = userRoles.some((role) =>
        allowedRoles.includes(role),
      );

      if (!hasAllowedRole) {
        return <Navigate to="/" replace />;
      }

      if (
        userRoles.length > 1 &&
        (activeRole === null || activeRole === undefined)
      ) {
        return <Navigate to="/choose-role" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

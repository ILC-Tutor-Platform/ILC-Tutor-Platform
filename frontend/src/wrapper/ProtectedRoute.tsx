import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SessionLoading from '../components/Loading';
import { UserAuth } from '../context/AuthContext';
import { useRoleStore } from '../stores/roleStore';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: number[];
  redirectTo?: string;

  allowUnauthenticated?: boolean;
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/signin',
  allowUnauthenticated = false,
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

  // ✅ Case 1: Not authenticated, but allowed
  if (!isAuthenticated || !user) {
    if (allowUnauthenticated) {
      return <>{children}</>;
    }

    return <Navigate to={redirectTo} replace />;
  }

  // ✅ Case 2: User is authenticated and allowed
  if (allowedRoles.length > 0) {
    if (activeRole !== null && activeRole !== undefined) {
      if (!allowedRoles.includes(activeRole)) {
        return <Navigate to="/" replace />;
      }
    } else {
      const userRole = user.role || [];
      const userRoles = Array.isArray(userRole)
        ? userRole.map((r) => (typeof r === 'string' ? parseInt(r) : r))
        : [typeof userRole === 'string' ? parseInt(userRole) : userRole];

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

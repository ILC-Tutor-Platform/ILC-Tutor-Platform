import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useRoleStore } from '../stores/roleStore';

type Props = {
  children: ReactNode;
};

const RedirectIfAuthenticated = ({ children }: Props) => {
  const { isAuthenticated, user } = UserAuth();
  const activeRole = useRoleStore((state) => state.activeRole);

  if (isAuthenticated && user) {
    if (activeRole !== null && activeRole !== undefined) {
      if (activeRole === 0) return <Navigate to="/profile/student" replace />;
      if (activeRole === 1) return <Navigate to="/profile/tutor" replace />;
      if (activeRole === 2)
        return <Navigate to="/admin/session-tracking" replace />;
    } else if (user.role && user.role.length > 0) {
      const firstRole =
        typeof user.role[0] === 'string'
          ? parseInt(user.role[0])
          : user.role[0];

      if (firstRole === 0) return <Navigate to="/profile/student" replace />;
      if (firstRole === 1) return <Navigate to="/profile/tutor" replace />;
      if (firstRole === 2)
        return <Navigate to="/admin/session-tracking" replace />;

      if (user.role.length > 1) {
        return <Navigate to="/choose-role" replace />;
      }
    }

    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;

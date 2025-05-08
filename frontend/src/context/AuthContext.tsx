import SessionLoading from '@/components/Loading';
import { useAuthStore, useTokenStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';
import type { StudentSignUp, TutorSignUp, UserPayload } from '@/types';
import { api } from '@/utils/axios';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: UserPayload | null;
  signInUser: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUpStudent: (
    user: StudentSignUp,
  ) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<boolean>;
  isAuthenticated: boolean;
  signUpTutor: (
    user: TutorSignUp,
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { setRoles, clearRoles } = useRoleStore.getState();

  const user = useAuthStore((state) => state.user);
  const { setUser, setRefreshToken, clearAuth } = useAuthStore.getState();
  const { accessToken, setAccessToken } = useTokenStore.getState();

  const isAuthenticated = Boolean(user && accessToken);

  // sign in user
  const signInUser = async (email: string, password: string) => {
    try {
      const res = await api.post(`auth/login`, { email, password });
      const { access_token, refresh_token, uid, role, name } = res.data;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      const userData = { uid, name, role };
      setUser(userData);
      setRoles(role.map(Number));

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed.',
      };
    }
  };

  // refresh token
  const refreshSession = async (): Promise<boolean> => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        return false;
      }

      const res = await api.post(`auth/login/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token } = res.data;
      setAccessToken(access_token);

      return true;
    } catch (error) {
      clearAuth();
      setAccessToken(null);
      clearRoles();
      console.error('Error refreshing session:', error);
      return false;
    }
  };

  const signOut = async () => {
    clearAuth();
    setAccessToken(null);
    clearRoles();
  };

  const signUpStudent = async (user: StudentSignUp) => {
    try {
      await api.post(`auth/signup/student`, {
        user: {
          name: user.user.name,
          email: user.user.email,
          password: user.user.password,
          datejoined: user.user.datejoined,
        },
        student: {
          student_number: user.student.student_number,
          degree_program: user.student.degree_program,
        },
      });

      console.log('User signed up successfully:', user.user.name);
      console.log('User signed up successfully:', user.student.student_number);
      console.log('User signed up successfully:', user.student.degree_program);
      console.log('User signed up successfully:', user.user.datejoined);

      useAuthStore.getState().setUser({
        email: user.user.email,
        name: user.user.name,
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Sign up failed.',
      };
    }
  };

  const signUpTutor = async (user: TutorSignUp) => {
    try {
      await api.post(`auth/signup/tutor`, {
        user: {
          name: user.user.name,
          email: user.user.email,
          password: user.user.password,
          datejoined: user.user.datejoined,
        },
        tutor: {
          description: user.tutor.description,
          status: 'pending',
        },
        availability: {
          availability: user.availability.availability,
          available_time_from: user.availability.available_time_from,
          available_time_to: user.availability.available_time_to,
        },
        affiliation: {
          affiliation: user.affiliation.affiliation,
        },
        expertise: {
          expertise: user.expertise.expertise,
        },
        socials: {
          socials: user.socials.socials,
        },
        subject: {
          subject_name: user.subject.subject_name,
        },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error signing up as tutor: ', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Sign up failed.',
      };
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedRefreshToken = useAuthStore.getState().refreshToken;
        const storedUser = useAuthStore.getState().user;

        if (!storedRefreshToken || !storedUser) {
          setLoading(false);
          return;
        }

        const refreshSuccess = await refreshSession();

        if (refreshSuccess) {
          setRoles(storedUser.role?.map(Number) || []);
        } else {
          clearAuth();
          setAccessToken(null);
          clearRoles();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearAuth();
        setAccessToken(null);
        clearRoles();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <SessionLoading msg="Checking your identity..." />;

  return (
    <AuthContext.Provider
      value={{
        user,
        signInUser,
        signOut,
        signUpStudent,
        refreshSession,
        isAuthenticated,
        signUpTutor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('UserAuth must be used within an AuthContextProvider');
  }
  return context;
};

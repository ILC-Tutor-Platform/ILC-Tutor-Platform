import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRoleStore } from "@/stores/roleStore";
import SessionLoading from "@/components/Loading";
import type { StudentSignUp } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { useTokenStore } from "@/stores/authStore";
import type { UserPayload } from "@/types";
import { api } from "@/utils/axios";


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
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

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
      const res = await axios.post(`${API_URL}auth/login`, { email, password });
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
        error: error.response?.data?.detail || "Login failed.",
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

      const res = await axios.post(`${API_URL}auth/login/refresh`, {
        refresh_token: refreshToken,
      });
      
      const { access_token } = res.data;
      setAccessToken(access_token);
      
      return true;
    } catch (error) {
      clearAuth();
      setAccessToken(null);
      clearRoles();
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
      await axios.post(`${API_URL}/auth/signup/student`, {
        user: {
          name: user.user.name,
          email: user.user.email,
          password: user.user.password,
          dateJoined: user.user.dateJoined,
        },
        student: {
          student_number: user.student.student_number,
          degree_program: user.student.degree_program,
        },
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || "Sign up failed.",
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
          setRoles(storedUser.role.map(Number));
        } else {
          clearAuth();
          setAccessToken(null);
          clearRoles();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        clearAuth();
        setAccessToken(null);
        clearRoles();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};

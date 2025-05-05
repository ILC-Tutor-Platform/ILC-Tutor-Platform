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

interface AuthContextType {
  user: { uid: string; name: string; role: number[] } | null;
  signInUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUpStudent: (user: StudentSignUp) => Promise<{ success: boolean; error?: string }>;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);


  const { setRoles, clearRoles } = useRoleStore.getState();

  const signInUser = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}auth/login`, {
        email,
        password,
      }, {
        withCredentials: true, // Important if using HttpOnly cookies
      });


      const { uid, role, name } = res.data;

      // Store in state + global store
      setUser({ uid, name, role });
      setRoles(role.map(Number));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed.",
      };

    }
  };

  const signOut = async () => {
    try {

      await axios.post(`${API_URL}auth/logout`, {}, { withCredentials: true });
      setUser(null);
      clearRoles();
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const signUpStudent = async (user: StudentSignUp) => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup/student`, {
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

  // Optional: auto-load user from backend (if using cookies)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}`, {
          withCredentials: true,
        });

        const { uid, role, name } = res.data;
        setUser({ uid, name, role });
        setRoles(role.map(Number));
      } catch {
        setUser(null);
        clearRoles();
      } finally {
        setLoading(false);
      }
    };


    checkAuth();
  }, []);

  if (loading) return <SessionLoading msg="Checking your identity..." />;

  return (

    <AuthContext.Provider value={{ user, signInUser, signOut, signUpStudent }}>

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


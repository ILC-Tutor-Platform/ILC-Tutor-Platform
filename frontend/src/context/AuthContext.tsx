import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import SessionLoading from "@/components/Loading";
import axios from "axios";
import type { StudentSignUp } from "@/types";
import { useRoleStore } from "@/stores/roleStore";

interface AuthContextType {
  session: Session | null;
  user: Session['user'] | null;
  signUpNewUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUpStudent: (
    user: StudentSignUp
  ) => Promise<{ success: boolean; error?: string }>;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Session['user'] | null>(null);

  const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      return { success: false, error: error.message };
    }

    console.log("User signed up:", data.user);
    return { success: true, data };
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
      return { success: true, data: res.data };
    } catch (error: any) {
      console.error("Sign up failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "An error occurred during sign up",
      };
    }
  };
/*
  const signInUser = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/dev/auth/login/student`, {
        email: email,
        password: password
      });
      return { success: true, data: res.data }
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "An error occurred during sign in.",
      };
    }
  }*/



  // Sign in
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      await loadingTime(1200); // Simulate loading time

      if (error) return {success: false, error: error.message}
      

      setLoading(false);
      return { success: true, session: data.session };

    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  const loadingTime = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

useEffect(() => {
  const { setRoles, clearRoles } = useRoleStore.getState();

  const init = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    await loadingTime(1000); // Simulate loading time

    setUser(session?.user || null);
    setSession(session);

    if (session?.user) {
      const rawRoles = session.user.user_metadata?.role;
      const parsedRoles = Array.isArray(rawRoles)
        ? rawRoles.map(Number)
        : [Number(rawRoles)].filter((n) => !isNaN(n));
      setRoles(parsedRoles);
    }

    setLoading(false); // We're done loading
  };

  init();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    setUser(session?.user || null);

    if (session?.user) {
      const rawRoles = session.user.user_metadata?.role;
      const parsedRoles = Array.isArray(rawRoles)
        ? rawRoles.map(Number)
        : [Number(rawRoles)].filter((n) => !isNaN(n));
      setRoles(parsedRoles);
    } else {
      clearRoles();
    }
  });

  return () => {
    subscription.unsubscribe(); // Clean up
  };
}, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }

    setSession(null);
    setLoading(false);
    console.log("User signed out");
  }

  if (loading) {
    return <SessionLoading msg="Getting your data" />;
  }

  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signInUser, signOut, signUpStudent, user }}
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

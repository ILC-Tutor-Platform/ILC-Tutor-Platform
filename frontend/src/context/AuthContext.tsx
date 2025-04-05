import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Adjust the import path as necessary
import { Session } from "@supabase/supabase-js"; // Import Supabase's Session type

interface AuthContextType {
    session: Session | null; // Correctly type the session
    signUpNewUser: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
    signInUser: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null); // Type the session state properly

    // Signup
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

    // Sign in 
    const signInUser = async (email: string, password: string) => {
        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
    
            if (error) {
                console.error("Error signing in:", error.message);
                return { success: false, error: error.message }; 
            }
    
            console.log("User signed in:", data.user);
            return { success: true, data };
        } catch (error) {
            console.error("Unexpected error during sign in:", error);
            return { 
                success: false, 
                error: "An unexpected error occurred. Please try again." }; 
        }
    };
    

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session); // Set the session state on initial load
        })

        supabase.auth.onAuthStateChange((_event, session ) => {
            setSession(session); // Update the session state on auth state change
        })
    }, []);

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        }
    }
    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
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

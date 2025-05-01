import { Navigate } from "react-router-dom"
import { UserAuth } from "@/context/AuthContext"
import { JSX } from "react";

interface Props {
    children: JSX.Element;
}

export const ProtectedRoute = ({children}: Props) => {
    const { session } = UserAuth();

    if (!session) {
        console.log("Wala pa ka nag sign in dawgz, redirecting to sign in page");
        return <Navigate to="/signin" />;
    }
  return children;
}

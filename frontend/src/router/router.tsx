import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Signin from "@/pages/Signin";
import SignupAs from "@/pages/SignUpAs";
import Home from "@/pages/Home";
import SignUpAsTutor from "@/pages/SignUpAsTutor";
import SignUpAsStudent from "@/pages/SignUpAsStudent";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <div>404</div>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/tutor",
                element: <div>Tutor</div>,
            },
            {
                path: "/profile",
                element: <div>Profile</div>,
            }
        ]
    },
    {
        path: "/signin",
        element: <Signin />,
    },
    {
        path: "/signup",
        element: <SignupAs />
    },
    {
        path: "/signup/student",
        element: <SignUpAsStudent/>,
    },
    {
        path: "/signup/tutor",
        element: <SignUpAsTutor />,
    }
]);
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <div>404</div>,
        children: [
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
        element: <Signup />
    },
    {
        path: "/signup/student",
        element: <Signup Student={true} />,
    },
    {
        path: "/signup/tutor",
        element: <Signup Student={false} />,
    }
]);
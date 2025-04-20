import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Signin from "@/pages/Signin";
import SignupAs from "@/pages/SignUpAs";
import Home from "@/pages/Home";
import SignUpAsTutor from "@/pages/SignUpAsTutor";
import SignUpAsStudent from "@/pages/SignUpAsStudent";
import StudentDashboardProfile from "@/pages/StudentDashboardProfile";
import TutorTracking from "@/pages/TutorTracking";
import StudentScheduleTracking from "@/pages/StudentScheduleTracking";
import StudentAnnouncements from "@/pages/StudentAnnouncements";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        element: <StudentDashboardProfile />,
      },
      {
        path: "/student/tutor-tracking",
        element: <TutorTracking />,
      },
      {
        path: "student/schedule-tracking", // 👈 your new page route
        element: <StudentScheduleTracking />,
      },
      {
        path: "student/announcements", // 👈 your new page route
        element: <StudentAnnouncements />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <SignupAs />,
  },
  {
    path: "/signup/student",
    element: <SignUpAsStudent />,
  },
  {
    path: "/signup/tutor",
    element: <SignUpAsTutor />,
  },
]);

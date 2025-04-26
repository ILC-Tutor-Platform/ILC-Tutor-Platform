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
import Tutors from "@/pages/Tutors";
import IndividualTutor from "@/pages/IndividualTutor";
import TutorProfile from "@/pages/TutorProfile";
import StudentTracking from "@/pages/StudentTracking";
import TutorSchedule from "@/pages/TutorSchedule";
import TutorAnnouncements from "@/pages/TutorAnnouncements";


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
        path: "/tutors",
        element: <Tutors />,
      },
      {
        path: "/tutors/:tutorName",
        element: <IndividualTutor />,
      },
      {
        path: "/profile/student",
        element: <StudentDashboardProfile />,
      },
      {
        path: "/profile/tutor",
        element: <TutorProfile />,
      },
      {
        path: "/studentprofile",
        element: <StudentDashboardProfile />,
      },
      {
        path: "/student/tutor-tracking",
        element: <TutorTracking />,
      },
      {
        path: "/student/schedule-tracking",
        element: <StudentScheduleTracking />,
      },
      {
        path: "/student/announcements",
        element: <StudentAnnouncements />,
      },
      {
        path: "/tutorprofile/student-tracking",
        element: <StudentTracking />,
      },
      {
        path: "/tutorprofile/schedule",
        element: <TutorSchedule />,
      },
      {
        path: "/tutorprofile/announcements",
        element: <TutorAnnouncements />,
      },
      {
        path: "/tutorprofile",
        element: <TutorProfile />,
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

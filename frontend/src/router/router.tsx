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
import VerifyEmail from "@/pages/VerifyEmail";
import { ProtectedRoute } from "@/wrapper/ProtectedRoute";
import PageNotFound from "@/pages/PageNotFound";

/*
todo:
[x] use auth context
[x] add auth guards
[] add protected routes based on roles
*/

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound/>,
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
        element: (
          <ProtectedRoute>
            <StudentDashboardProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor",
        element: (
          <ProtectedRoute>
            <TutorProfile />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute>
            <StudentAnnouncements />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor/student-tracking",
        element: (
          <ProtectedRoute>
            <StudentTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor/schedule",
        element: (
          <ProtectedRoute>
            <TutorSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor/announcements",
        element: (
          <ProtectedRoute>
            <TutorAnnouncements />
          </ProtectedRoute>
        ),
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
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
]);

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
[x] add protected routes based on roles
*/

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
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
          <ProtectedRoute allowedRoles={[0]}>
            <StudentDashboardProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor",
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <TutorProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/student/tutor-tracking",
        element: (
          <ProtectedRoute allowedRoles={[0]}>
            <TutorTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/student/schedule-tracking",
        element: (
          <ProtectedRoute allowedRoles={[0]}>
            <StudentScheduleTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/student/announcements",
        element: (
          <ProtectedRoute allowedRoles={[0]}>
            <StudentAnnouncements />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor/student-tracking",
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <StudentTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor/schedule",
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <TutorSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/tutor/announcements",
        element: (
          <ProtectedRoute allowedRoles={[1]}>
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

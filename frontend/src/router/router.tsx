import App from '@/App';
import ChooseRole from '@/pages/ChooseRole';
import Home from '@/pages/Home';
import IndividualTutor from '@/pages/IndividualTutor';
import PageNotFound from '@/pages/PageNotFound';
import Signin from '@/pages/Signin';
import SignupAs from '@/pages/SignUpAs';
import SignUpAsStudent from '@/pages/SignUpAsStudent';
import SignUpAsTutor from '@/pages/SignUpAsTutor';
import StudentAnnouncements from '@/pages/StudentAnnouncements';
import StudentDashboardProfile from '@/pages/StudentDashboardProfile';
import StudentScheduleTracking from '@/pages/StudentScheduleTracking';
import StudentTracking from '@/pages/StudentTracking';
import TutorAnnouncements from '@/pages/TutorAnnouncements';
import TutorProfile from '@/pages/TutorProfile';
import Tutors from '@/pages/Tutors';
import TutorSchedule from '@/pages/TutorSchedule';
import TutorTracking from '@/pages/TutorTracking';
import VerifyEmail from '@/pages/VerifyEmail';
import ProtectedRoute from '@/wrapper/ProtectedRoute';
import RedirectIfAuthenticated from '@/wrapper/RedirectIfAuthenticated';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/tutors',
        element: <Tutors />,
      },
      {
        path: '/tutors/:tutorName',
        element: <IndividualTutor />,
      },
      {
        path: '/profile/student',
        element: (
          <ProtectedRoute allowedRoles={[0]}>
            <StudentDashboardProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/tutor',
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <TutorProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/student/tutor-tracking',
        element: (
          <ProtectedRoute allowedRoles={[0]}>
            <TutorTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/student/schedule-tracking',
        element: (
          <ProtectedRoute allowedRoles={[0]}>
            <StudentScheduleTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/student/announcements',
        element: (
          <ProtectedRoute allowedRoles={[0]}>
            <StudentAnnouncements />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/tutor/student-tracking',
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <StudentTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/tutor/schedule',
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <TutorSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/tutor/announcements',
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <TutorAnnouncements />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/signin',
    element: (
      <RedirectIfAuthenticated>
        <Signin />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/signup',
    element: (
      <RedirectIfAuthenticated>
        <SignupAs />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/signup/student',
    element: (
      <RedirectIfAuthenticated>
        <SignUpAsStudent />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/signup/tutor',
    element: (
      <RedirectIfAuthenticated>
        <SignUpAsTutor />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <RedirectIfAuthenticated>
        <VerifyEmail />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/choose-role',
    element: <ChooseRole />,
  },
]);

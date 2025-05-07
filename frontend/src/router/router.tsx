import App from '@/App';
import Home from '@/pages/Home';
import IndividualTutor from '@/pages/IndividualTutor';
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
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404</div>,
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
        element: <StudentDashboardProfile />,
      },
      {
        path: '/profile/tutor',
        element: <TutorProfile />,
      },
      {
        path: '/studentprofile',
        element: <StudentDashboardProfile />,
      },
      {
        path: '/student/tutor-tracking',
        element: <TutorTracking />,
      },
      {
        path: '/student/schedule-tracking',
        element: <StudentScheduleTracking />,
      },
      {
        path: '/student/announcements',
        element: <StudentAnnouncements />,
      },
      {
        path: '/tutorprofile/student-tracking',
        element: <StudentTracking />,
      },
      {
        path: '/tutorprofile/schedule',
        element: <TutorSchedule />,
      },
      {
        path: '/tutorprofile/announcements',
        element: <TutorAnnouncements />,
      },
      {
        path: '/tutorprofile',
        element: <TutorProfile />,
      },
    ],
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <SignupAs />,
  },
  {
    path: '/signup/student',
    element: <SignUpAsStudent />,
  },
  {
    path: '/signup/tutor',
    element: <SignUpAsTutor />,
  },
]);

import logo from '@/assets/AralLinkLogo.svg';
import bell from '@/assets/bell.svg';
import profile from '@/assets/profile.svg';
import { UserAuth } from '@/context/AuthContext';
import { useRoleStore } from '@/stores/roleStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import TutorSidebar from './TutorSidebar';
import { Button } from './ui/button';

const NavbarMobile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut, refreshSession } = UserAuth();
  const { toggle, close } = useSidebarStore();
  const activeRole = useRoleStore((state) => state.activeRole);
  const [, setSessionChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const checkSession = async () => {
      if (isAuthenticated && user) {
        await refreshSession();
      }
      setSessionChecked(true);
    };

    checkSession();

    const refreshInterval = setInterval(
      () => {
        if (isAuthenticated) {
          refreshSession();
        }
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, refreshSession, user]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await sleep(1000);
      await signOut();
      navigate('/signin');
      console.log('Signed out successfully!');
      toast.success('Signed out successfully!', {
        duration: 3000,
        style: {
          backgroundColor: '#ffffff',
          color: 'green',
          fontSize: '16px',
          boxShadow: '0px 4px 4px 3px rgba(48, 123, 116, 0.40)',
        },
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center shadow-md sticky top-0 bg-white py-5 px-5 z-50 gap-4">
        <div className="flex items-center gap-4">
          {isAuthenticated && user && (
            <span>
              <Menu className="cursor-pointer" onClick={toggle} />
              {activeRole === 0 && <StudentSidebar />}
              {activeRole === 1 && <TutorSidebar />}
              {activeRole === 2 && <AdminSidebar />}
            </span>
          )}
          <NavLink to={'/'} onClick={close} className="flex gap-4 items-center">
            <img src={logo} alt="" className="w-25 h-auto" />
            {activeRole == 0 && (
              <div className="py-1 px-2 bg-[#307B74] rounded-xl flex items-center gap-2 shadow-md">
                <div className="text-white text-[10px] font-montserrat">
                  Student
                </div>
              </div>
            )}
            {activeRole == 1 && (
              <div className="py-1 px-2 bg-[#307B74] rounded-xl flex items-center gap-2 shadow-md">
                <div className="text-white text-[10px] font-montserrat">
                  Tutor
                </div>
              </div>
            )}
            {activeRole == 2 && (
              <div className="py-1 px-2 bg-[#307B74] rounded-xl flex items-center gap-2 shadow-md">
                <div className="text-white text-[10px] font-montserrat">
                  Admin
                </div>
              </div>
            )}
          </NavLink>
        </div>

        <div>
          <ul className="flex items-center gap-4">
            {isAuthenticated && user && (
              <>
                <li>
                  {activeRole === 0 && (
                    <Link to={'/profile/student/announcements'}>
                      <img src={bell} alt="" />
                    </Link>
                  )}
                  {activeRole === 1 && (
                    <Link to={'/profile/tutor/announcements'}>
                      <img src={bell} alt="" />
                    </Link>
                  )}
                </li>
                <li>
                  {activeRole === 0 && (
                    <Link to={'/profile/student'}>
                      <img src={profile} alt="" />
                    </Link>
                  )}
                  {activeRole === 1 && (
                    <Link to={'/profile/tutor'}>
                      <img src={profile} alt="" />
                    </Link>
                  )}
                </li>
              </>
            )}
            {(!isAuthenticated || !user) && (
              <li>
                <NavLink
                  to={'/tutors'}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-ilc-yellow underline underline-offset-[15px]'
                      : 'hover:text-ilc-yellow underline-offset-[15px] hover:underline'
                  }
                >
                  Tutors
                </NavLink>
              </li>
            )}
            <li className="border-[2px] border-gray-300 border-dashed">
              <Button
                onClick={() =>
                  isAuthenticated && user
                    ? handleSignOut()
                    : navigate('/signin')
                }
                variant={'yellow-button'}
                className="text-xs"
              >
                {loading
                  ? 'Signing out...'
                  : isAuthenticated && user
                    ? 'Sign Out'
                    : 'Sign In'}
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavbarMobile;

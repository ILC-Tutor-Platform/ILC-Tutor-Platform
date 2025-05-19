import Logo from '@/assets/AralLinkLogo.svg';
import { UserAuth } from '@/context/AuthContext';
import { useRoleStore } from '@/stores/roleStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BadgeIcon from '../assets/user2.svg';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import TutorSidebar from './TutorSidebar';
import { Button } from './ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const { toggle } = useSidebarStore();
  const activeRole = useRoleStore((state) => state.activeRole);
  const { isAuthenticated, user, signOut, refreshSession } = UserAuth();
  const [, setSessionChecked] = useState(false);

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
    try {
      setTimeout(async () => {
        await signOut();
        navigate('/signin');
        console.log('Signed out successfully!');
        toast.success('Signed out successfully!', {
          duration: 3000,
          style: {
            backgroundColor: '#ffffff',
            color: '#307B74',
            fontSize: '16px',
            boxShadow: '0px 4px 4px 3px rgba(48, 123, 116, 0.40)',
          },
        });
      }, 1000);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-20 py-7 shadow-md sticky top-0 bg-white z-50">
      {isAuthenticated && user && (
        <span className="absolute left-7">
          <Menu
            className="cursor-pointer"
            onClick={toggle}
            width={32}
            height={32}
          />
          {activeRole === 0 && <StudentSidebar />}
          {activeRole === 1 && <TutorSidebar />}
          {activeRole === 2 && <AdminSidebar />}
        </span>
      )}
      <NavLink to={'/'} className="flex gap-4 items-center">
        <img src={Logo} alt="Logo" className="w-35 h-auto" />
        {activeRole == 0 && (
          <div className="py-1 px-2 bg-[#307B74] rounded-xl flex items-center gap-2 shadow-md">
            <img className="w-4 h-4" src={BadgeIcon} alt="badge icon" />
            <div className="text-white text-[10px] font-montserrat">
              Student
            </div>
          </div>
        )}
        {activeRole == 1 && (
          <div className="py-1 px-2 bg-[#307B74] rounded-xl flex items-center gap-2 shadow-md">
            <img className="w-4 h-4" src={BadgeIcon} alt="badge icon" />
            <div className="text-white text-[10px] font-montserrat">Tutor</div>
          </div>
        )}
        {activeRole == 2 && (
          <div className="py-1 px-2 bg-[#307B74] rounded-xl flex items-center gap-2 shadow-md">
            <img className="w-4 h-4" src={BadgeIcon} alt="badge icon" />
            <div className="text-white text-[10px] font-montserrat">Admin</div>
          </div>
        )}
      </NavLink>

      <ul className="flex gap-10 items-center relative">
        <li>
          <NavLink
            to={'/'}
            className={({ isActive }) =>
              isActive
                ? 'text-ilc-yellow underline underline-offset-[15px]'
                : 'hover:text-ilc-yellow underline-offset-[15px] hover:underline'
            }
          >
            Home
          </NavLink>
        </li>

        {activeRole !== 1 && activeRole !== 2 && (
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

        {isAuthenticated && user && (
          <li className="flex gap-5">
            {activeRole === 0 && (
              <NavLink
                to={'/profile/student'}
                className={({ isActive }) =>
                  isActive
                    ? 'text-ilc-yellow underline underline-offset-[15px]'
                    : 'hover:text-ilc-yellow underline-offset-[15px] hover:underline'
                }
              >
                Profile
              </NavLink>
            )}
            {activeRole === 1 && (
              <NavLink
                to={'/profile/tutor'}
                className={({ isActive }) =>
                  isActive
                    ? 'text-ilc-yellow underline underline-offset-[15px]'
                    : 'hover:text-ilc-yellow underline-offset-[15px] hover:underline'
                }
              >
                Profile
              </NavLink>
            )}
            {activeRole === 2 && (
              <NavLink
                to={'/admin/session-tracking'}
                className={({ isActive }) =>
                  isActive
                    ? 'text-ilc-yellow underline underline-offset-[15px]'
                    : 'hover:text-ilc-yellow underline-offset-[15px] hover:underline'
                }
              >
                Sessions
              </NavLink>
            )}
            {activeRole === 2 && (
              <NavLink
                to={'/admin/tutor-tracking'}
                className={({ isActive }) =>
                  isActive
                    ? 'text-ilc-yellow underline underline-offset-[15px]'
                    : 'hover:text-ilc-yellow underline-offset-[15px] hover:underline'
                }
              >
                Tutor Tracking
              </NavLink>
            )}
          </li>
        )}

        <li className="border-[2px] border-gray-300 border-dashed">
          <Button
            variant={'yellow-button'}
            size={'navbar-size'}
            onClick={
              isAuthenticated && user
                ? handleSignOut
                : () => navigate('/signin')
            }
          >
            {isAuthenticated && user ? 'Sign out' : 'Sign in'}
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

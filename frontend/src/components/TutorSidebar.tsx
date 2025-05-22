import { useSidebarStore } from '@/stores/sidebarStore';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Schedule from '../assets/calendar.svg';
import Tutor from '../assets/coach.svg';
import Announcements from '../assets/megaphone.svg';
import Profile from '../assets/user.svg';

const TutorSidebar = () => {
  const { isOpen, toggle } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = isOpen ? (isMobile ? '6rem' : '7rem') : '0rem';

  return (
    <aside
      className="fixed min-h-screen top-0 left-0 bg-[#F9F8F4] transition-all duration-300 ease-in-out flex flex-col items-center justify-center shadow-2xl"
      style={{ width: sidebarWidth }}
    >
      {isOpen && (
        <>
          <Menu
            className="absolute top-8 cursor-pointer"
            onClick={toggle}
            width={28}
            height={28}
          />
          <div className="flex flex-col justify-center items-center gap-7">
            {[
              { label: 'Profile', icon: Profile, route: '/profile/tutor' },
              {
                label: 'Students',
                icon: Tutor,
                route: '/profile/tutor/student-tracking',
              },
              {
                label: 'Schedule',
                icon: Schedule,
                route: '/profile/tutor/schedule',
              },
              {
                label: 'Announcements',
                icon: Announcements,
                route: '/profile/tutor/announcements',
                large: true,
              },
            ].map((item) => (
              <Link
                to={item.route}
                key={item.label}
                className="w-full"
                onClick={toggle}
              >
                <button className="flex flex-col items-center gap-1.5 w-full text-black hover:text-[#307B74] transition-colors cursor-pointer">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={item.large ? 'w-5 h-5' : 'w-4 h-4'}
                  />
                  <span
                    className={`${
                      item.large ? 'text-xs' : 'text-xs'
                    } font-medium text-center`}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default TutorSidebar;

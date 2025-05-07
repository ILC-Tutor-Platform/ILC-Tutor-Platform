import { useEffect, useState } from 'react';
import StudentSidebar from '../components/TutorSidebar';

const TutorAnnouncements = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 7 : 0;

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = sidebarOpen
        ? `${sidebarWidth}rem`
        : '0rem';
    }
    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen font-manrope relative flex">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className="transition-all duration-300 ease-in-out flex-1"
        style={{ marginLeft: `${sidebarWidth}rem` }}
      >
        <main className="p-4 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-5rem)]">
          <div
            className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6"
            style={{
              color: '#8A1538',
              fontFamily: 'Montserrat',
              fontWeight: 700,
              wordWrap: 'break-word',
            }}
          >
            <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Announcements
            </span>
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[1.25rem] p-4 md:p-6 lg:p-8 xl:p-10 shadow-md">
            <div className="w-full h-full bg-white border border-[#FF9D02] rounded-[1.25rem] p-4 md:p-6 lg:p-8 mb-4 md:mb-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-1 md:mb-2">
                April 1, 2025
              </p>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-1 font-manrope">
                AralLink Update
              </p>
              <p className="text-sm md:text-base text-gray-800 font-manrope">
                (Description)
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorAnnouncements;

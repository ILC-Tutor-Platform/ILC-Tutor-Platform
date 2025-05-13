import { useSidebarStore } from '@/stores/sidebarStore';
import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminTutorTracking = () => {
  const { isOpen, toggle } = useSidebarStore();
  const sidebarWidth = isOpen ? 7 : 0;

  const [tutors, setTutors] = useState<any[]>([]);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = isOpen
        ? `${sidebarWidth}rem`
        : '0rem';
    }
    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, [isOpen, sidebarWidth]);

  useEffect(() => {
    // Mock tutor data
    const mockTutors = Array.from({ length: 8 }).map((_, index) => ({
      name: `Tutor ${index + 1}`,
      subject: `Subject ${index + 1}`,
      dateTime: `Date & Time ${index + 1}`,
    }));
    setTutors(mockTutors);
  }, []);

  return (
    <div className="min-h-screen font-manrope relative flex">
      <AdminSidebar sidebarOpen={isOpen} setSidebarOpen={toggle} />

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
              fontSize: '2rem',
            }}
          >
            <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Tutor Tracking
            </span>
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[1.25rem] p-4 md:p-6 lg:p-8 xl:p-10 shadow-md">
            <div className="w-full">
              <div className="grid grid-cols-4 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center text-xs sm:text-sm md:text-base">
                <div>Name</div>
                <div>Subject</div>
                <div>Date & Time</div>
                <div>Action</div>
              </div>

              {tutors.map((tutor, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-3 mt-2 text-center text-xs sm:text-sm md:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-[0.875rem]">👤</span>
                    </div>
                    <span className="text-[0.9rem]">{tutor.name}</span>
                  </div>
                  <div className="text-[0.9rem]">{tutor.subject}</div>
                  <div className="text-[0.9rem]">{tutor.dateTime}</div>
                  <div className="flex justify-center gap-2">
                    <button className="bg-[#8A1538] hover:bg-[#73122f] text-white text-xs px-3 py-1 rounded">
                      ✖
                    </button>
                    <button className="bg-[#307B74] hover:bg-[#24625b] text-white text-xs px-3 py-1 rounded">
                      ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTutorTracking;

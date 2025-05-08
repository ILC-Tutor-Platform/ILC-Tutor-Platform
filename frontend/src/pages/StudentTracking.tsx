import { useEffect, useState } from 'react';

const StudentTracking = () => {
  const [, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(false);
    const navbar = document.querySelector('nav');
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = '0rem';
    }
    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, []);

  return (
    <div className="min-h-screen font-manrope relative flex">
      <div className="transition-all duration-300 ease-in-out flex-1">
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
              My Students
            </span>
            <button className="see-history-button text-sm sm:text-base md:text-base lg:text-lg xl:text-xl">
              See History
            </button>
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[1.25rem] p-4 md:p-6 lg:p-8 xl:p-10 shadow-md">
            <div className="w-full">
              <div className="grid grid-cols-4 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center text-xs sm:text-sm md:text-base">
                <div>Name</div>
                <div>Subject</div>
                <div>Date & Time</div>
                <div>Action</div>
              </div>

              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-3 mt-2 text-center text-xs sm:text-sm md:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-[0.875rem]">👤</span>
                    </div>
                    <span className="text-[0.9rem]">Name</span>
                  </div>
                  <div className="text-[0.9rem]">Subject</div>
                  <div className="text-[0.9rem]">Date & Time</div>
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

export default StudentTracking;

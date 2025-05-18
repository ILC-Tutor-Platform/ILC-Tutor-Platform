import { AdminSessionTrackingLoading } from '@/components/TutorLoadingSkeleton';
import type { AdminSessionTracking } from '@/types';
import { api } from '@/utils/axios';
import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminSessionTracking = () => {
  const [, setSidebarOpen] = useState(true);
  const [session, setSession] = useState<AdminSessionTracking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
    const navbar = document.querySelector('nav');

    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = '0rem';
    }

    fetchSession();

    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, []);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ session: AdminSessionTracking[] }>(
        '/sessions/admin',
      );
      const session = response.data.session;
      setSession(session);
      console.log(session);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen font-manrope relative flex">
      <AdminSidebar />

      <div className="transition-all duration-300 ease-in-out flex-1">
        <main className="px-5 py-10 md:w-[80%] md:mx-auto min-h-[calc(100vh-5rem)]">
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
              Session Tracking
            </span>
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[1.25rem] p-4 md:p-6 lg:p-8 xl:p-10 shadow-md">
            <div className="w-full flex flex-col gap-4">
              <div className="grid grid-cols-5 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center text-xs sm:text-sm md:text-base">
                <div>Student</div>
                <div>Tutor</div>
                <div>Date & Time</div>
                <div>Subject</div>
                <div>Status</div>
              </div>
              {loading ? (
                <div className="grid gap-4">
                  {Array(10)
                    .fill(0)
                    .map((_, index) => (
                      <AdminSessionTrackingLoading key={index} />
                    ))}
                </div>
              ) : (
                <>
                  {session.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">
                      No sessions found.
                    </div>
                  )}
                  {session.map((session, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 items-center bg-white rounded-md px-4 py-3 text-center text-xs sm:text-sm lg:py-5 shadow-sm"
                    >
                      <div className="text-[0.6rem] md:text-base">
                        {session.student_name}
                      </div>
                      <div className="text-[0.6rem] md:text-base">
                        {session.tutor_name}
                      </div>
                      <div className="text-[0.6rem] md:text-base">
                        {session.date} : {session.time}
                      </div>
                      <div className="text-[0.6rem] md:text-base">
                        {session.subject}
                      </div>
                      <div>
                        <span
                          className={`border text-[0.5rem] md:text-base px-3 py-1 rounded-full ${
                            session.status_id === 1
                              ? 'border-[#307B74] text-[#307B74]'
                              : session.status_id === 2
                                ? 'border-[#8A1538] text-[#8A1538]'
                                : 'border-gray-400 text-gray-500'
                          }`}
                        >
                          {session.status_id === 1 && 'APPROVED'}
                          {session.status_id === 2 && 'DECLINED'}
                          {session.status_id === 3 && 'PENDING'}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSessionTracking;

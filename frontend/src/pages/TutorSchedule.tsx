import type { Schedule } from '@/types';
import { api } from '@/utils/axios';
import { useEffect, useState } from 'react';

const TutorSchedule = () => {
  const [, setSidebarOpen] = useState(true);
  const [schedules, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<'history' | null>(null);
  const [historySessions, setHistorySessions] = useState<Schedule[]>([]);


  useEffect(() => {
    setSidebarOpen(false);
    const navbar = document.querySelector('nav');
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = '0rem';
    }

    fetchUpcomingSchedule();

    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, []);

    const fetchHistorySchedule = async () => {
      setLoading(true);
      try {
        const response = await api.get<{ session: Schedule[] }>('/sessions/student');

        const allSchedules = response.data.session;

        const now = new Date();
        const pastSchedules = allSchedules.filter((session) => {
          const sessionDate = new Date(session.date); 
          return sessionDate < now;
        });

        setHistorySessions(pastSchedules); 
    } catch (error) {
        console.error('Error fetching history schedule:', error);
    } finally {
        setLoading(false);
    }};

  const fetchUpcomingSchedule = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ session: Schedule[] }>('/sessions/student');

      const allSchedules = response.data.session;

      // Filter out past sessions — assuming each session has a `start_time` field in ISO format
      const now = new Date();

      const upcomingSchedules = allSchedules.filter((session) => {
        const sessionDate = new Date(session.date); 
        return sessionDate >= now;
      });

      setSchedule(upcomingSchedules);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex lg:w-[80%] lg:mx-auto">
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
              My Schedule
            </span>
            <button className="see-history-button text-sm sm:text-base md:text-base lg:text-lg xl:text-xl" 
                onClick={() => {
                  fetchHistorySchedule();
                  setActiveModal('history');
                }}>
              See History
            </button>
          </div>
          {activeModal === 'history' && (
            <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
                {historySessions.length === 0 ? (
                  <p className="text-gray-600">No past sessions available.</p>
                ) : (
                  <ul className="space-y-4">
                    {historySessions.map((session, index) => (
                      <li key={index} className="p-4 border border-gray-300 rounded-md">
                        <p className="text-lg font-semibold text-[#8A1538]">
                          {session.subject || 'Session Title'}
                        </p>
                        <p className="text-sm text-gray-700">
                          Date: {new Date(session.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700">
                          Time: {session.time}
                        </p>
                        <p className="text-sm text-gray-700">
                          Tutor: {session.name || 'N/A'}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[1.25rem] p-4 md:p-6 lg:p-8 xl:p-10 shadow-md">
            <div className="w-full">
              {/* Header Row */}
              <div className="grid grid-cols-4 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center text-xs sm:text-sm md:text-base">
                <div>Student</div>
                <div>Date & Time</div>
                <div>Subject</div>
                <div>Status</div>
              </div>

              {loading ? (
                <div className="text-center text-gray-500 mt-4">Loading...</div>
              ) : schedules.length === 0 ? (
                <div className="text-center text-gray-500 mt-4 text-sm sm:text-base">
                  You have no upcoming sessions yet.
                </div>
              ) : (
                schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-3 mt-2 text-center text-xs sm:text-sm md:text-base"
                  >
                    <div>{schedule.name}</div>
                    <div>
                      {schedule.subject} {schedule.topic}
                    </div>
                    <div>{`${schedule.date} ${schedule.time}`}</div>
                    <div>
                      <span className="border text-xs px-3 py-1 rounded-full border-[#307B74] text-[#307B74]">
                        APPROVED
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorSchedule;

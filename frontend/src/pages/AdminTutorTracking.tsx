import type { TutorRequests } from '@/types';
import { api } from '@/utils/axios';
import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminTutorTracking = () => {
  const [, setSidebarOpen] = useState(true);
  const [tutors, setTutors] = useState<TutorRequests[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
    const navbar = document.querySelector('nav');

    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = '0rem';
    }

    fetchTutorRequests();

    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, []);

  const fetchTutorRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ tutor_requests: TutorRequests[] }>(
        '/tutor-requests',
      );
      const tutorRequests = response.data?.tutor_requests ?? [];

      console.log('Tutors: ', tutorRequests);
      setTutors(tutorRequests);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (tutorId: string, status: number) => {
    try {
      await api.put(`/tutor-requests/${tutorId}/status`, { status });
      console.log('Status updated successfully', status);
      fetchTutorRequests();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen font-manrope relative flex">
      <AdminSidebar />{' '}
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
              Tutor Tracking
            </span>
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[1.25rem] p-4 md:p-6 lg:p-8 xl:p-10 shadow-md">
            <div className="w-full">
              <div className="grid grid-cols-4 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center text-xs sm:text-sm md:text-base">
                <div>Name</div>
                <div>Subject</div>
                <div>Expertise</div>
                <div>Action</div>
              </div>

              {loading ? (
                <div className="text-center text-gray-500 mt-4">Loading...</div>
              ) : tutors.length === 0 ? (
                <div className="text-center text-gray-500 mt-4 text-sm sm:text-base">
                  You have no scheduled sessions yet.
                </div>
              ) : (
                tutors.map((tutor, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-3 mt-2 text-center text-xs sm:text-sm md:text-base"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-[0.875rem]">👤</span>
                      </div>
                      <span className="text-[0.9rem]">{tutor.tutor_name}</span>
                    </div>
                    <div className="text-[0.9rem]">{tutor.subject}</div>
                    <div className="text-[0.9rem]">{tutor.expertise}</div>
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-[#8A1538] hover:bg-[#73122f] text-white text-xs px-3 py-1 rounded"
                        onClick={() => handleStatusUpdate(tutor.tutor_id, 1)}
                      >
                        ✖
                      </button>
                      <button
                        className="bg-[#307B74] hover:bg-[#24625b] text-white text-xs px-3 py-1 rounded"
                        onClick={() => handleStatusUpdate(tutor.tutor_id, 2)}
                      >
                        ✓
                      </button>
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

export default AdminTutorTracking;

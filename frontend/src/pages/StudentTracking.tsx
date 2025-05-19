import type { StudentResponse } from '@/types';
import { api } from '@/utils/axios';
import axios from 'axios';
import { useEffect, useState } from 'react';

const StudentTracking = () => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<'history' | null>(null);
  const [historyRequests, setHistoryRequests] = useState<StudentResponse[]>([]);


  useEffect(() => {
    setSidebarOpen(false);
    const navbar = document.querySelector('nav');
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = '0rem';
    }

    fetchStudents();

    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get<StudentResponse[]>(
        '/tutor/student-requests',
      );

      const allStudentRequests = response.data;
      
      const now = new Date();

      const upcomingRequests = allStudentRequests.filter((student) => {
        const sessionDate = new Date(student.date); 
        return sessionDate >= now;
      });
      setStudents(upcomingRequests);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const fetchHistorySchedule = async () => {
        setLoading(true);
        try {
          const response = await api.get<{ session: StudentResponse[] }>('/tutor/student-requests');
  
          const allRequests = response.data.session;
  
          const now = new Date();
          const pastRequests = allRequests.filter((student) => {
            const studentDate = new Date(student.date); 
            return studentDate < now;
          });
  
          setHistoryRequests(pastRequests); 
      } catch (error) {
          console.error('Error fetching history schedule:', error);
      } finally {
          setLoading(false);
      }};

  const handleStatusUpdate = async (session_id: string, status_id: number) => {
    try {
      const payload = { session_id, status_id };
      console.log('Sending payload:', payload);
      await api.post(`/session/update-requests`, payload);

      // Remove the student from the list after updating status
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.session_id !== session_id),
      );
      console.log(`Status updated to ${status_id} for session ${session_id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      } else {
        console.error('Error:', error);
      }
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
              My Students
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
                {historyRequests.length === 0 ? (
                  <p className="text-gray-600">No past student requests available.</p>
                ) : (
                  <ul className="space-y-4">
                    {historyRequests.map((student, index) => (
                      <li key={index} className="p-4 border border-gray-300 rounded-md">
                        <p className="text-lg font-semibold text-[#8A1538]">
                          {student.subject || 'student Title'}
                        </p>
                        <p className="text-sm text-gray-700">
                          Date: {new Date(student.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700">
                          Time: {student.time}
                        </p>
                        <p className="text-sm text-gray-700">
                          Tutor: {student.name || 'N/A'}
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
              <div className="grid grid-cols-4 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center text-xs sm:text-sm md:text-base">
                <div>Name</div>
                <div>Subject</div>
                <div>Date & Time</div>
                <div>Action</div>
              </div>
              {loading ? (
                <div className="text-center text-gray-500 mt-4">Loading...</div>
              ) : students.length === 0 ? (
                <div className="text-center text-gray-500 mt-4 text-sm sm:text-base">
                  There are no current student requests yet.
                </div>
              ) : (
                students.map((student, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-3 mt-2 text-center text-xs sm:text-sm md:text-base"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-[0.875rem]">👤</span>
                      </div>
                      <span className="text-[0.9rem]">{student.name}</span>
                    </div>
                    <div className="text-[0.9rem]">
                      {student.subject} {student.topic}
                    </div>
                    <div className="text-[0.9rem]">
                      {new Date(student.date).toLocaleDateString()}{' '}
                      {student.time}
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(student.session_id, 2)
                        }
                        className="bg-[#8A1538] hover:bg-[#73122f] text-white text-xs px-3 py-1 rounded"
                      >
                        ✖
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(student.session_id, 1)
                        }
                        className="bg-[#307B74] hover:bg-[#24625b] text-white text-xs px-3 py-1 rounded"
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

export default StudentTracking;

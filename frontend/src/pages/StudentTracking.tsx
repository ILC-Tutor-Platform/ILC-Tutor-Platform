import { useEffect, useState } from 'react';
import type { StudentResponse } from '@/types';
import { api } from '@/utils/axios';
import axios from 'axios';


const StudentTracking = () => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

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
      const response = await api.get<StudentResponse[]>('/tutor/student-requests'); 
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleStatusUpdate = async (session_id: string, status_id: number) => {
  try {
    const payload = { session_id, status_id };
    console.log('Sending payload:', payload);  
    await api.post(`/session/update-requests`, payload);

    // Remove the student from the list after updating status
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.session_id !== session_id)
    );
    console.log(`Status updated to ${status_id} for session ${session_id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data); 
      } else {
        console.error('Unknown error:', error);
      }
    }
  };


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
              { students.length === 0 ? (
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
                    <div className="text-[0.9rem]">{student.subject} {student.topic}</div>
                    <div className="text-[0.9rem]">
                      {new Date(student.date).toLocaleDateString()} {student.time}
                    </div>
                    <div className="flex justify-center gap-2">
                      <button 
                          onClick={() => handleStatusUpdate(student.session_id, 2)}
                          className="bg-[#8A1538] hover:bg-[#73122f] text-white text-xs px-3 py-1 rounded">
                        ✖
                      </button>
                      <button 
                          onClick={() => handleStatusUpdate(student.session_id, 1)}
                          className="bg-[#307B74] hover:bg-[#24625b] text-white text-xs px-3 py-1 rounded">
                        ✓
                      </button>
                    </div>
                  </div>
                ))
              )
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentTracking;

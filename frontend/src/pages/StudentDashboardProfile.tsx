import { useTokenStore } from '@/stores/authStore';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import EditIcon from '../assets/edit.svg';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.svg';
import { UserAuth } from '../context/AuthContext';

const StudentDashboardProfile = () => {
  const { user } = UserAuth();
  const accessToken = useTokenStore((state) => state.accessToken);
  const [student, setStudent] = useState({
    name: '',
    student_number: '',
    degree_program: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    'personal' | 'education' | null
  >(null);
  const [editPersonalData, setEditPersonalData] = useState({
    name: '',
  });
  const [editEducationData, setEditEducationData] = useState({
    student_number: '',
    degree_program: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  const openPersonalModal = () => {
    setEditPersonalData({
      name: student.name,
    });
    setActiveModal('personal');
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const openEducationModal = () => {
    setEditEducationData({
      student_number: student.student_number,
      degree_program: student.degree_program,
    });
    setActiveModal('education');
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handlePersonalInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPersonalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEducationInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditEducationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePersonalChanges = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      if (!user?.uid || !accessToken) {
        throw new Error('User not authenticated');
      }

      if (!editPersonalData.name.trim()) {
        setUpdateError('Name is required');
        setIsUpdating(false);
        return;
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile/update`,
        {
          user: {
            name: editPersonalData.name.trim(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setStudent((prev) => ({
        ...prev,
        name: editPersonalData.name,
      }));

      setUpdateSuccess('Personal information updated successfully!');

      setTimeout(() => {
        setActiveModal(null);
        setRefreshKey((prevKey) => prevKey + 1);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to update student data:', err);
      setUpdateError(
        err.response?.data?.detail ||
          'Failed to update personal information. Please try again.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEducationChanges = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      if (!user?.uid || !accessToken) {
        throw new Error('User not authenticated');
      }

      if (
        !editEducationData.student_number.trim() ||
        !editEducationData.degree_program.trim()
      ) {
        setUpdateError('Student number and degree program are required');
        setIsUpdating(false);
        return;
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile/update`,
        {
          student: {
            student_number: editEducationData.student_number,
            degree_program: editEducationData.degree_program,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setStudent((prev) => ({
        ...prev,
        student_number: editEducationData.student_number,
        degree_program: editEducationData.degree_program,
      }));

      setUpdateSuccess('Education information updated successfully!');

      setTimeout(() => {
        setActiveModal(null);
        setRefreshKey((prevKey) => prevKey + 1);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to update education data:', err);
      setUpdateError(
        err.response?.data?.detail ||
          'Failed to update education information. Please try again.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!user?.uid || !accessToken) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!res.data.user) {
          throw new Error('User data not found in response');
        }

        setStudent({
          name: res.data.user.name || '',
          student_number: res.data.student?.student_number || '',
          degree_program: res.data.student?.degree_program || '',
          email: res.data.user.email || '',
        });
      } catch (err: any) {
        console.error('Failed to fetch student data:', err);
        setError(
          err.response?.data?.detail ||
            `Failed to load student data: ${err.message || 'Unknown error'}. Please try again later.`,
        );
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchStudent();
  }, [user, accessToken, refreshKey]);

  return (
    <div className="min-h-screen relative flex lg:w-[80%] lg:mx-auto">
      {/* Personal Information Modal */}
      {activeModal === 'personal' && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color: '#8A1538',
                fontFamily: 'Montserrat',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              Update Personal Information
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editPersonalData.name}
                  onChange={handlePersonalInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                />
              </div>
            </div>

            {updateError && (
              <div className="text-red-500 mb-4 text-sm">{updateError}</div>
            )}

            {updateSuccess && (
              <div className="text-green-500 mb-4 text-sm">{updateSuccess}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                disabled={isUpdating}
              >
                Go Back
              </button>
              <button
                onClick={handleSavePersonalChanges}
                className="px-4 py-2 rounded-md text-white hover:bg-opacity-90 transition"
                style={{
                  borderRadius: '5px',
                  background: '#FF9D02',
                }}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education Information Modal */}
      {activeModal === 'education' && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-[1rem]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto my-auto flex flex-col max-h-[90vh]">
            <h2
              className="text-2xl font-bold p-[1.5rem] pb-0"
              style={{
                color: '#8A1538',
                fontFamily: 'Montserrat',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              Update Education Information
            </h2>

            <div className="overflow-y-auto px-[1.5rem] pb-[1rem] pt-[1rem] space-y-[1rem]">
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Student Number
                </label>
                <input
                  type="text"
                  name="student_number"
                  value={editEducationData.student_number}
                  onChange={handleEducationInputChange}
                  className="w-full p-[0.5rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Degree Program
                </label>
                <select
                  name="degree_program"
                  value={editEducationData.degree_program}
                  onChange={handleEducationInputChange}
                  className="w-full p-[0.5rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                >
                  <option value="">Select a degree program</option>
                  <option value="AA Sports Studies">AA Sports Studies</option>
                  <option value="BA Communication and Media Arts">
                    BA Communication and Media Arts
                  </option>
                  <option value="BA English (Creative Writing)">
                    BA English (Creative Writing)
                  </option>
                  <option value="BS Agribusiness Economics">
                    BS Agribusiness Economics
                  </option>
                  <option value="BS Anthropology">BS Anthropology</option>
                  <option value="BS Applied Mathematics">
                    BS Applied Mathematics
                  </option>
                  <option value="BS Architecture">BS Architecture</option>
                  <option value="BS Biology">BS Biology</option>
                  <option value="BS Computer Science">
                    BS Computer Science
                  </option>
                  <option value="BS Data Science">BS Data Science</option>
                  <option value="BS Food Technology">BS Food Technology</option>
                  <option value="BS Sports Science">BS Sports Science</option>
                </select>
              </div>
            </div>

            {updateError && (
              <div className="text-red-500 text-sm px-[1.5rem]">
                {updateError}
              </div>
            )}

            {updateSuccess && (
              <div className="text-green-500 text-sm px-[1.5rem]">
                {updateSuccess}
              </div>
            )}

            <div className="flex justify-end space-x-[0.75rem] px-[1.5rem] py-[1rem] border-t border-gray-200">
              <button
                onClick={() => setActiveModal(null)}
                className="px-[1rem] py-[0.5rem] border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                disabled={isUpdating}
              >
                Go Back
              </button>
              <button
                onClick={handleSaveEducationChanges}
                className="px-[1rem] py-[0.5rem] rounded-md text-white hover:bg-opacity-90 transition"
                style={{ borderRadius: '5px', background: '#FF9D02' }}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="transition-all duration-300 ease-in-out flex-1">
        <main className="p-4 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-5rem)]">
          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4 md:-mt-5 lg:-mt-10">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl whitespace-nowrap"
              style={{
                color: '#8A1538',
                fontFamily: 'Montserrat',
                fontWeight: 700,
              }}
            >
              My Profile
            </h1>
          </div>

          <div className="w-full min-h-[calc(100vh-12rem)] bg-[#F9F8F4] shadow-md rounded-2xl border border-black border-opacity-30 p-5 md:p-7 lg:p-9 flex flex-col">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8 -mt-2">
              <img
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-cover"
                src={ProfilePlaceholder}
                alt="Profile"
              />
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-8">
                Loading profile information...
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center">
                {/* Personal Information Section */}
                <div className="w-full md:w-[55%] lg:w-[50%] xl:w-[45%] bg-white shadow-lg rounded-lg border border-opacity-10 relative p-5 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-black text-lg md:text-xl font-Montserrat font-semibold truncate">
                      Personal Information
                    </h3>
                    <button
                      className="ml-4 p-1 hover:bg-gray-100 rounded"
                      onClick={openPersonalModal}
                      aria-label="Edit personal information"
                    >
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Name
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {student.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Email
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {student.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Education Information Section */}
                <div className="w-full md:w-[55%] lg:w-[50%] xl:w-[45%] bg-white shadow-lg rounded-lg border border-opacity-10 relative p-5 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-black text-lg md:text-xl font-Montserrat font-semibold truncate">
                      Education Information
                    </h3>
                    <button
                      className="ml-4 p-1 hover:bg-gray-100 rounded"
                      onClick={openEducationModal}
                      aria-label="Edit education information"
                    >
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Student Number
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {student.student_number || 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Degree Program
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {student.degree_program || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardProfile;

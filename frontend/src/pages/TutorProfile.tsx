import { useTokenStore } from '@/stores/authStore';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EditIcon from '../assets/edit.svg';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.svg';
import BadgeIcon from '../assets/user2.svg';
import { UserAuth } from '../context/AuthContext';

const TutorProfile = () => {
  const { user } = UserAuth();
  const accessToken = useTokenStore((state) => state.accessToken);
  const [tutor, setTutor] = useState({
    first_name: '',
    middle_initial: '',
    last_name: '',
    facebook_link: '',
    linkedin_link: '',
    subjects: [] as string[],
    affiliations: [] as string[],
    expertise: [] as string[],
    description: '',
    dates_available: [] as Date[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    'personal' | 'tutoring' | null
  >(null);
  const [editPersonalData, setEditPersonalData] = useState({
    first_name: '',
    middle_initial: '',
    last_name: '',
    facebook_link: '',
    linkedin_link: '',
  });
  const [editTutoringData, setEditTutoringData] = useState({
    subjects: [] as string[],
    affiliations: [] as string[],
    expertise: [] as string[],
    description: '',
    dates_available: [] as Date[],
  });
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentAffiliation, setCurrentAffiliation] = useState('');
  const [currentExpertise, setCurrentExpertise] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const openPersonalModal = () => {
    setEditPersonalData({
      first_name: tutor.first_name,
      middle_initial: tutor.middle_initial,
      last_name: tutor.last_name,
      facebook_link: tutor.facebook_link,
      linkedin_link: tutor.linkedin_link,
    });
    setActiveModal('personal');
  };

  const openTutoringModal = () => {
    setEditTutoringData({
      subjects: [...tutor.subjects],
      affiliations: [...tutor.affiliations],
      expertise: [...tutor.expertise],
      description: tutor.description,
      dates_available: [...tutor.dates_available],
    });
    setActiveModal('tutoring');
  };

  const handlePersonalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setEditPersonalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTutoringInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditTutoringData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSubject = () => {
    if (currentSubject.trim()) {
      setEditTutoringData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, currentSubject.trim()],
      }));
      setCurrentSubject('');
    }
  };

  const removeSubject = (index: number) => {
    setEditTutoringData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const addAffiliation = () => {
    if (currentAffiliation.trim()) {
      setEditTutoringData((prev) => ({
        ...prev,
        affiliations: [...prev.affiliations, currentAffiliation.trim()],
      }));
      setCurrentAffiliation('');
    }
  };

  const removeAffiliation = (index: number) => {
    setEditTutoringData((prev) => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index),
    }));
  };

  const addExpertise = () => {
    if (currentExpertise.trim()) {
      setEditTutoringData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, currentExpertise.trim()],
      }));
      setCurrentExpertise('');
    }
  };

  const removeExpertise = (index: number) => {
    setEditTutoringData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setEditTutoringData((prev) => ({
        ...prev,
        dates_available: [...prev.dates_available, date],
      }));
    }
  };

  const removeDate = (index: number) => {
    setEditTutoringData((prev) => ({
      ...prev,
      dates_available: prev.dates_available.filter((_, i) => i !== index),
    }));
  };

  const handleSavePersonalChanges = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      if (user?.uid && accessToken) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}users/profile`,
          {
            name: `${editPersonalData.first_name} ${editPersonalData.middle_initial} ${editPersonalData.last_name}`.trim(),
            facebook_link: editPersonalData.facebook_link,
            linkedin_link: editPersonalData.linkedin_link,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setTutor((prev) => ({
          ...prev,
          first_name: editPersonalData.first_name,
          middle_initial: editPersonalData.middle_initial,
          last_name: editPersonalData.last_name,
          facebook_link: editPersonalData.facebook_link,
          linkedin_link: editPersonalData.linkedin_link,
        }));

        setActiveModal(null);
      }
    } catch (err) {
      console.error('Failed to update tutor data:', err);
      setUpdateError(
        'Failed to update personal information. Please try again.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTutoringChanges = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      if (user?.uid && accessToken) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}tutors/profile`,
          {
            subjects: editTutoringData.subjects,
            affiliations: editTutoringData.affiliations,
            expertise: editTutoringData.expertise,
            description: editTutoringData.description,
            dates_available: editTutoringData.dates_available,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setTutor((prev) => ({
          ...prev,
          subjects: editTutoringData.subjects,
          affiliations: editTutoringData.affiliations,
          expertise: editTutoringData.expertise,
          description: editTutoringData.description,
          dates_available: editTutoringData.dates_available,
        }));

        setActiveModal(null);
      }
    } catch (err) {
      console.error('Failed to update tutoring data:', err);
      setUpdateError('Failed to update tutoring details. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        if (user?.uid && accessToken) {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}users/profile`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const fullName = res.data.user?.name || '';
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || '';
          const middleInitial = nameParts.length > 2 ? nameParts[1] : '';
          const lastName =
            nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

          setTutor({
            first_name: firstName,
            middle_initial: middleInitial,
            last_name: lastName,
            facebook_link: res.data.tutor?.facebook_link || '',
            linkedin_link: res.data.tutor?.linkedin_link || '',
            subjects: res.data.tutor?.subjects || [],
            affiliations: res.data.tutor?.affiliations || [],
            expertise: res.data.tutor?.expertise || [],
            description: res.data.tutor?.description || '',
            dates_available: res.data.tutor?.dates_available
              ? res.data.tutor.dates_available.map(
                  (date: string) => new Date(date),
                )
              : [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch tutor data:', err);
        setError('Failed to load tutor data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [user, accessToken]);

  return (
    <div className="min-h-screen font-manrope relative flex">
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
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editPersonalData.first_name}
                  onChange={handlePersonalInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editPersonalData.last_name}
                  onChange={handlePersonalInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Middle Initial
                </label>
                <input
                  type="text"
                  name="middle_initial"
                  value={editPersonalData.middle_initial}
                  onChange={handlePersonalInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                  maxLength={1}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Facebook Link
                </label>
                <input
                  type="url"
                  name="facebook_link"
                  value={editPersonalData.facebook_link}
                  onChange={handlePersonalInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  LinkedIn Link
                </label>
                <input
                  type="url"
                  name="linkedin_link"
                  value={editPersonalData.linkedin_link}
                  onChange={handlePersonalInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                />
              </div>
            </div>

            {updateError && (
              <div className="text-red-500 mb-4 text-sm">{updateError}</div>
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

      {activeModal === 'tutoring' && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-[1rem]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto my-auto flex flex-col max-h-[90vh]">
            {/* Header */}
            <h2
              className="text-2xl font-bold p-[1.5rem] pb-0"
              style={{
                color: '#8A1538',
                fontFamily: 'Montserrat',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              Update Tutoring Details
            </h2>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-[1.5rem] pb-[1rem] pt-[1rem] space-y-[1rem]">
              {/* Subjects */}
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Subjects
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentSubject}
                    onChange={(e) => setCurrentSubject(e.target.value)}
                    className="w-full p-[0.5rem] pr-[4rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                    placeholder="Add a subject"
                  />
                  <button
                    onClick={addSubject}
                    className="absolute right-[0.25rem] top-1/2 transform -translate-y-1/2 px-[0.75rem] py-[0.25rem] rounded-md text-white"
                    style={{ background: '#FF9D02' }}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-[0.5rem] flex flex-wrap gap-[0.5rem]">
                  {editTutoringData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-[0.75rem] py-[0.25rem]"
                    >
                      <span>{subject}</span>
                      <button
                        onClick={() => removeSubject(index)}
                        className="ml-[0.5rem] text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affiliations */}
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Affiliations
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentAffiliation}
                    onChange={(e) => setCurrentAffiliation(e.target.value)}
                    className="w-full p-[0.5rem] pr-[4rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                    placeholder="Add an affiliation"
                  />
                  <button
                    onClick={addAffiliation}
                    className="absolute right-[0.25rem] top-1/2 transform -translate-y-1/2 px-[0.75rem] py-[0.25rem] rounded-md text-white"
                    style={{ background: '#FF9D02' }}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-[0.5rem] flex flex-wrap gap-[0.5rem]">
                  {editTutoringData.affiliations.map((affiliation, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-[0.75rem] py-[0.25rem]"
                    >
                      <span>{affiliation}</span>
                      <button
                        onClick={() => removeAffiliation(index)}
                        className="ml-[0.5rem] text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Expertise
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentExpertise}
                    onChange={(e) => setCurrentExpertise(e.target.value)}
                    className="w-full p-[0.5rem] pr-[4rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                    placeholder="Add an expertise"
                  />
                  <button
                    onClick={addExpertise}
                    className="absolute right-[0.25rem] top-1/2 transform -translate-y-1/2 px-[0.75rem] py-[0.25rem] rounded-md text-white"
                    style={{ background: '#FF9D02' }}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-[0.5rem] flex flex-wrap gap-[0.5rem]">
                  {editTutoringData.expertise.map((expertise, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-[0.75rem] py-[0.25rem]"
                    >
                      <span>{expertise}</span>
                      <button
                        onClick={() => removeExpertise(index)}
                        className="ml-[0.5rem] text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editTutoringData.description}
                  onChange={handleTutoringInputChange}
                  className="w-full p-[0.5rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                  rows={2}
                />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Dates Available
                </label>
                <DatePicker
                  selected={null}
                  onChange={handleDateChange}
                  className="w-full p-[0.5rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                  placeholderText="Select a date"
                />
                <div className="mt-[0.5rem] flex flex-wrap gap-[0.5rem]">
                  {editTutoringData.dates_available.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-[0.75rem] py-[0.25rem]"
                    >
                      <span>{date.toLocaleDateString()}</span>
                      <button
                        onClick={() => removeDate(index)}
                        className="ml-[0.5rem] text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {updateError && (
              <div className="text-red-500 text-sm px-[1.5rem]">
                {updateError}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-[0.75rem] px-[1.5rem] py-[1rem] border-t border-gray-200">
              <button
                onClick={() => setActiveModal(null)}
                className="px-[1rem] py-[0.5rem] border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                disabled={isUpdating}
              >
                Go Back
              </button>
              <button
                onClick={handleSaveTutoringChanges}
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

      {/* Rest of the component remains the same */}
      <div className="transition-all duration-300 ease-in-out flex-1">
        <main className="p-4 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-5rem)]">
          {/* Profile Header */}
          <div
            className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6"
            style={{
              color: '#8A1538',
              fontFamily: 'Montserrat',
              fontWeight: 700,
            }}
          >
            <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              My Profile
            </span>

            <div className="pl-3 pr-3 pt-1 pb-1 md:pl-4 md:pr-4 md:pt-2 md:pb-2 bg-[#307B74] rounded-xl flex items-center gap-2">
              <img
                className="w-5 h-5 md:w-6 md:h-6"
                src={BadgeIcon}
                alt="badge icon"
              />
              <div className="text-white text-xs md:text-sm lg:text-base xl:text-lg font-bold font-montserrat">
                Tutor
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] shadow-md rounded-2xl border border-black border-opacity-30 p-6 md:p-8 lg:p-10 flex flex-col gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <img
                className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52"
                src={ProfilePlaceholder}
                alt="Profile"
              />
              <button
                className="mt-3 text-center text-base md:text-lg lg:text-xl text-black font-normal underline"
                onClick={() => console.log('Update Photo clicked')}
              >
                Update Photo
              </button>
            </div>

            {/* Loading/Error */}
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8 md:gap-10 w-full justify-center">
                {/* Personal Information Section */}
                <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] bg-white shadow-lg rounded-lg border border-opacity-10 relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-black text-xl md:text-2xl font-Montserrat font-semibold">
                      Personal Information
                    </div>
                    <button
                      className="ml-4 p-1 hover:bg-gray-100 rounded"
                      onClick={openPersonalModal}
                    >
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        First Name
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.first_name || 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Last Name
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.last_name || 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Middle Initial
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.middle_initial || 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Facebook Link
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.facebook_link ? (
                          <a
                            href={tutor.facebook_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {tutor.facebook_link}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        LinkedIn Link
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.linkedin_link ? (
                          <a
                            href={tutor.linkedin_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {tutor.linkedin_link}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tutoring Details Section */}
                <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] bg-white shadow-lg rounded-lg border border-opacity-10 relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-black text-xl md:text-2xl font-Montserrat font-semibold">
                      Tutoring Details
                    </div>
                    <button
                      className="ml-4 p-1 hover:bg-gray-100 rounded"
                      onClick={openTutoringModal}
                    >
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Subjects
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.subjects.length > 0
                          ? tutor.subjects.join(', ')
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Affiliations
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.affiliations.length > 0
                          ? tutor.affiliations.join(', ')
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Expertise
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.expertise.length > 0
                          ? tutor.expertise.join(', ')
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Description
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.description || 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#A19A9A] font-semibold w-1/3">
                        Dates Available
                      </span>
                      <span className="text-black font-semibold text-right w-2/3">
                        {tutor.dates_available.length > 0
                          ? tutor.dates_available
                              .map((date) => date.toLocaleDateString())
                              .join(', ')
                          : 'N/A'}
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

export default TutorProfile;

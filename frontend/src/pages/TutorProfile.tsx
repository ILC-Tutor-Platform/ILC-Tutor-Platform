import DropdownSubjects from '@/components/DropdownSubject';
import { useTokenStore } from '@/stores/authStore';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EditIcon from '../assets/edit.svg';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.svg';
import { UserAuth } from '../context/AuthContext';

const TutorProfile = () => {
  const { user } = UserAuth();
  const accessToken = useTokenStore((state) => state.accessToken);
  const [tutor, setTutor] = useState({
    name: '',
    email: '',
    facebook_link: '',
    linkedin_link: '',
    subjects: [] as string[],
    topics: {} as Record<string, string[]>,
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
    name: '',
    social_links: [] as string[],
  });
  const [editTutoringData, setEditTutoringData] = useState({
    subjects: [] as string[],
    topics: {} as Record<string, string[]>,
    affiliations: [] as string[],
    expertise: [] as string[],
    description: '',
    dates_available: [] as Date[],
  });
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentAffiliation, setCurrentAffiliation] = useState('');
  const [currentExpertise, setCurrentExpertise] = useState('');
  const [currentSocialLink, setCurrentSocialLink] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentSubjectDropdown, setCurrentSubjectDropdown] = useState<
    string | null
  >(null);

  const openPersonalModal = () => {
    setEditPersonalData({
      name: tutor.name,
      social_links: [tutor.facebook_link, tutor.linkedin_link].filter(
        (link) => link,
      ),
    });
    setActiveModal('personal');
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const openTutoringModal = () => {
    setEditTutoringData({
      subjects: [...tutor.subjects],
      topics: { ...tutor.topics },
      affiliations: [...tutor.affiliations],
      expertise: [...tutor.expertise],
      description: tutor.description,
      dates_available: [...tutor.dates_available],
    });
    setActiveModal('tutoring');
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const addSocialLink = () => {
    if (currentSocialLink.trim()) {
      setEditPersonalData((prev) => ({
        ...prev,
        social_links: [...prev.social_links, currentSocialLink.trim()],
      }));
      setCurrentSocialLink('');
    }
  };

  const removeSocialLink = (index: number) => {
    setEditPersonalData((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  const addSubject = () => {
    if (currentSubject?.trim()) {
      setEditTutoringData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, currentSubject?.trim()],
      }));
      setCurrentSubject('');
    }
  };

  const removeSubject = (index: number) => {
    setEditTutoringData((prev) => {
      const subjectToRemove = prev.subjects[index];
      const updatedSubjects = prev.subjects.filter((_, i) => i !== index);

      // Create a new topics object without the removed subject
      const updatedTopics = { ...prev.topics };
      delete updatedTopics[subjectToRemove];

      return {
        ...prev,
        subjects: updatedSubjects,
        topics: updatedTopics,
      };
    });
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

  const addTopic = () => {
    if (currentTopic.trim() && currentSubjectDropdown) {
      setEditTutoringData((prev) => ({
        ...prev,
        topics: {
          ...prev.topics,
          [currentSubjectDropdown]: [
            ...(prev.topics[currentSubjectDropdown] || []),
            currentTopic.trim(),
          ],
        },
      }));
      setCurrentTopic('');
    }
  };

  const removeTopic = (subject: string, index: number) => {
    setEditTutoringData((prev) => ({
      ...prev,
      topics: {
        ...prev.topics,
        [subject]: prev.topics[subject].filter((_, i) => i !== index),
      },
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
      // `${import.meta.env.VITE_BACKEND_URL}/users/profile/update`
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile/update`,
        {
          user: {
            name: editPersonalData.name.trim(),
          },
          socials: {
            socials: editPersonalData.social_links,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setTutor((prev) => ({
        ...prev,
        name: editPersonalData.name,
        facebook_link: editPersonalData.social_links[0] || '',
        linkedin_link: editPersonalData.social_links[1] || '',
      }));

      setUpdateSuccess('Personal information updated successfully!');
      setTimeout(() => {
        setActiveModal(null);
        setRefreshKey((prevKey) => prevKey + 1);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to update tutor data:', err.response?.data || err);
      setUpdateError(
        err.response?.data?.detail ||
          'Failed to update personal information. Please try again.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTutoringChanges = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      if (!user?.uid || !accessToken) {
        throw new Error('User not authenticated');
      }

      if (!editTutoringData.description.trim()) {
        setUpdateError('Description is required');
        setIsUpdating(false);
        return;
      }

      const formattedDates = editTutoringData.dates_available.map((date) => {
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        return typeof date === 'string'
          ? date
          : new Date().toISOString().split('T')[0];
      });

      // Filter topics to only include those for existing subjects
      const topicsPayload: Record<string, string[]> = {};
      editTutoringData.subjects.forEach((subject) => {
        if (
          editTutoringData.topics[subject] &&
          editTutoringData.topics[subject].length > 0
        ) {
          topicsPayload[subject] = editTutoringData.topics[subject];
        }
      });

      const payload = {
        tutor: {
          description: editTutoringData.description.trim(),
          status: 'active',
        },
        availability: {
          availability: formattedDates,

          available_time_from: formattedDates.map(() => '09:00:00.000Z'),
          available_time_to: formattedDates.map(() => '17:00:00.000Z'),
        },
        affiliation: {
          affiliation: editTutoringData.affiliations,
        },
        expertise: {
          expertise: editTutoringData.expertise,
        },
        subject: {
          subject_name: editTutoringData.subjects,
        },
        topic: topicsPayload, // Use filtered topics payload
      };

      console.log(
        'Payload being sent (filtered):',
        JSON.stringify(payload, null, 2),
      );

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('API response:', response.data);

      setTutor((prev) => ({
        ...prev,
        subjects: editTutoringData.subjects,
        affiliations: editTutoringData.affiliations,
        expertise: editTutoringData.expertise,
        description: editTutoringData.description,
        dates_available: editTutoringData.dates_available,
        topics: topicsPayload, // Use the filtered topics
      }));

      setUpdateSuccess('Tutoring information updated successfully!');
      setTimeout(() => {
        setActiveModal(null);
        setRefreshKey((prev) => prev + 1);
      }, 3000);
    } catch (err: any) {
      console.error('Update error:', err);
      console.error('Response data:', err.response?.data);
      console.error('Status code:', err.response?.status);

      let errorMessage =
        'Failed to update tutoring information. Please try again.';

      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid data format. Please check your inputs.';
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = 'Authentication failed. Please log in again.';
      }

      setUpdateError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        if (!user?.uid || !accessToken) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        // `${import.meta.env.VITE_BACKEND_URL}/users/profile`
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('API response data:', res.data);

        if (!res.data.tutor) {
          throw new Error('Tutor data not found in response');
        }

        const tutorData = res.data.tutor;
        const name = res.data.user?.name || '';
        const email = res.data.user?.email || user.email || '';

        let subjects: string[] = [];
        if (Array.isArray(tutorData.subjects)) {
          if (typeof tutorData.subjects[0] === 'string') {
            subjects = tutorData.subjects;
          } else {
            subjects = tutorData.subjects.map((sub: any) =>
              typeof sub === 'string' ? sub : sub.subject_name || String(sub),
            );
          }
        }

        let expertise: string[] = [];
        if (Array.isArray(tutorData.expertise)) {
          expertise = tutorData.expertise.map((exp: any) => {
            if (typeof exp === 'string') {
              return exp;
            } else if (typeof exp === 'object' && exp.expertise) {
              return exp.expertise;
            } else if (typeof exp === 'object' && exp.expertise_name) {
              return exp.expertise_name;
            }
            return String(exp);
          });
        }

        let affiliations: string[] = [];
        if (Array.isArray(tutorData.affiliations)) {
          affiliations = tutorData.affiliations.map((aff: any) => {
            if (typeof aff === 'string') {
              return aff;
            } else if (typeof aff === 'object' && aff.affiliation) {
              return aff.affiliation;
            } else if (typeof aff === 'object' && aff.affiliation_name) {
              return aff.affiliation_name;
            }
            return String(aff);
          });
        }

        let topics: Record<string, string[]> = {};

        if (
          tutorData.topics &&
          typeof tutorData.topics === 'object' &&
          !Array.isArray(tutorData.topics)
        ) {
          // Directly assign if it's an object mapping subjects to topic arrays
          topics = tutorData.topics;
        } else if (Array.isArray(tutorData.topics)) {
          // fallback for old formats (array of strings)
          topics['General'] = tutorData.topics;
        } else {
          // empty fallback
          topics = {};
        }

        const datesAvailable = Array.isArray(tutorData.availability)
          ? tutorData.availability.map((dateStr: string) => new Date(dateStr))
          : [];

        const socials = Array.isArray(tutorData.socials)
          ? tutorData.socials
          : [];

        setTutor({
          name,
          email,
          facebook_link: socials[0] || '',
          linkedin_link: socials[1] || '',
          subjects,
          topics: topics,
          affiliations,
          expertise,
          description: tutorData.description || '',
          dates_available: datesAvailable,
        });
        console.log(tutorData);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(
          err.response?.data?.detail ||
            `Failed to load tutor data: ${err.message || 'Unknown error'}`,
        );
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchTutor();
  }, [user, accessToken, refreshKey]);

  const socialLinks = [tutor.facebook_link, tutor.linkedin_link].filter(
    (link) => link,
  );

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
                  onChange={(e) =>
                    setEditPersonalData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Social Links</label>
                <div className="relative">
                  <input
                    type="url"
                    value={currentSocialLink}
                    onChange={(e) => setCurrentSocialLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSocialLink()}
                    className="w-full p-2 pr-[4rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                    placeholder="Add a social link"
                  />
                  <button
                    onClick={addSocialLink}
                    className="absolute right-[0.25rem] top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-white"
                    style={{ background: '#FF9D02' }}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editPersonalData.social_links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span className="truncate max-w-xs">{link}</span>
                      <button
                        onClick={() => removeSocialLink(index)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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

      {/* Tutoring Details Modal */}
      {activeModal === 'tutoring' && (
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
              Update Tutoring Details
            </h2>

            <div className="overflow-y-auto px-[1.5rem] pb-[1rem] pt-[1rem] space-y-[1rem]">
              {/* Subjects */}
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Subjects
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentSubject ?? ''}
                    onChange={(e) => setCurrentSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
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

              {/* Topics */}
              <div>
                <label className="block text-gray-700 mb-[0.25rem]">
                  Topics
                </label>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={currentTopic}
                      onChange={(e) => setCurrentTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                      className="w-full p-[0.5rem] pr-[4rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                      placeholder="Add a topic"
                    />
                    <button
                      onClick={addTopic}
                      className="absolute right-[0.25rem] top-1/2 transform -translate-y-1/2 px-[0.75rem] py-[0.25rem] rounded-md text-white"
                      style={{ background: '#FF9D02' }}
                    >
                      Add
                    </button>
                  </div>
                  <DropdownSubjects
                    subjects={editTutoringData.subjects}
                    selectedSubject={currentSubjectDropdown}
                    setSelectedSubject={setCurrentSubjectDropdown}
                    className="w-full"
                  />
                </div>
                <div className="mt-[0.5rem] flex flex-col gap-[1rem]">
                  {Object.entries(editTutoringData.topics).map(
                    ([subject, topicList]) => (
                      <div key={subject}>
                        <h4 className="font-semibold mb-[0.25rem]">
                          {subject}
                        </h4>
                        <div className="flex flex-wrap gap-[0.5rem]">
                          {topicList.map((topic, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-gray-100 rounded-full px-[0.75rem] py-[0.25rem]"
                            >
                              <span>{topic}</span>
                              <button
                                onClick={() => removeTopic(subject, index)}
                                className="ml-[0.5rem] text-gray-500 hover:text-gray-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
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
                    onKeyPress={(e) => e.key === 'Enter' && addAffiliation()}
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
                    onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
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
                  onChange={(e) =>
                    setEditTutoringData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-[0.5rem] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8A1538]"
                  rows={4}
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
                  minDate={new Date()}
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

      {/* Main Profile Content */}
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
                className="w-30 h-30 md:w-40 md:h-40 lg:w-50 lg:h-50 rounded-full"
                src={ProfilePlaceholder}
                alt="Profile"
              />
            </div>

            {loading ? (
              <div className="text-center text-gray-500">
                Loading profile data...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8 md:gap-10 w-full justify-center">
                {/* Personal Information Section */}
                <div className="w-full md:w-[55%] lg:w-[50%] xl:w-[45%] bg-white shadow-lg rounded-lg border border-opacity-10 relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-black text-xl font-Montserrat font-semibold">
                      Personal Information
                    </div>
                    <button
                      className="ml-4 p-1 hover:bg-gray-100 rounded"
                      onClick={openPersonalModal}
                    >
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Name
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {tutor.name || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Email
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {tutor.email || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Socials Links
                      </span>
                      <div className="text-black font-semibold md:text-right md:w-2/3">
                        {socialLinks.length > 0 ? (
                          <div className="flex flex-col space-y-1">
                            {socialLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate max-w-full"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutoring Details Section */}
                <div className="w-full md:w-[55%] lg:w-[50%] xl:w-[45%] bg-white shadow-lg rounded-lg border border-opacity-10 relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-black text-xl font-Montserrat font-semibold">
                      Tutoring Details
                    </div>
                    <button
                      className="ml-4 p-1 hover:bg-gray-100 rounded"
                      onClick={openTutoringModal}
                    >
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Subjects
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {tutor.subjects.length > 0
                          ? tutor.subjects.join(', ')
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Affiliations
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {tutor.affiliations.length > 0
                          ? tutor.affiliations.join(', ')
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Expertise
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
                        {tutor.expertise.length > 0
                          ? tutor.expertise.join(', ')
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3 shrink-0">
                        Description
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 line-clamp-2">
                        {tutor.description || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                      <span className="text-[#A19A9A] font-semibold md:w-1/3">
                        Dates Available
                      </span>
                      <span className="text-black font-semibold md:text-right md:w-2/3 truncate">
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

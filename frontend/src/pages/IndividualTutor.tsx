import DropdownDatesAvail from '@/components/DropdownDatesAvail';
import DropdownTopicsAvail from '@/components/DropdownTopicsAvail';
import { TutorErrorState } from '@/components/TutorErrorState';
import { TutorLoadingSkeleton } from '@/components/TutorLoadingSkeleton';
import TutorCard from '@/components/ui/TutorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';
import type { TutorDetail } from '@/types';
import { api } from '@/utils/axios';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const IndividualTutor = () => {
  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { tutor_id } = useParams<{ tutor_id: string }>();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedModality, setSelectedModality] = useState<string>('online');
  const [roomNumber, setRoomNumber] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [selectedDateTime] = selectedDates;
  const [date, time_from] = selectedDateTime?.split('|') || [];
  const [validateError, setValidateError] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTopicID, setSelectedTopicID] = useState<string[]>([]);
  const activeRole = useRoleStore((state) => state.activeRole);
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchTutor = async () => {
      if (!tutor_id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/tutors/${tutor_id}`);
        const tutorData = response.data;
        console.log(response.data);
        if (!tutorData) {
          throw new Error('Tutor data not found in response');
        }

        setTutor(tutorData);
      } catch (error) {
        console.error('Error fetching tutor:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load tutor information. Please try again.',
        );
        setTutor(null);
      } finally {
        await sleep(1000);
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutor_id]);

  const safeJoin = (
    value: string | string[] | undefined,
    separator = ', ',
    defaultValue = 'Not specified',
  ) => {
    if (Array.isArray(value)) {
      return value.join(separator) || defaultValue;
    }
    return value || defaultValue;
  };

  const handleModalityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedModality(value);
  };

  const payload = {
    date: date,
    time: time_from,
    tutor_id: tutor_id,
    student_id: user?.uid,
    topic_id: selectedTopicID[0],
    status: 0,
    time_started: null,
    time_ended: null,
    duration: null,
    room_number: roomNumber,
    modality: selectedModality,
  };

  const handleRequestSession = async () => {
    console.log('REQUESTING SESSION...');
    setRequestLoading(true);
    if (!selectedDateTime) {
      setValidateError('Please select a date and time.');
      setRequestLoading(false);
      return;
    }
    if (selectedModality === 'in-person' && !roomNumber) {
      setValidateError('Please input room number.');
      setRequestLoading(false);
      return;
    }
    if (activeRole !== 0) {
      setValidateError(
        'You are not allowed to request a session. Please login as a student.',
      );
      setRequestLoading(false);
      return;
    }
    try {
      await sleep(1000);
      await api.post('session/student/request', payload);
      console.log('Session requested successfully');
      toast.success(
        'Successfully requested session. Please wait for the tutor to accept.',
        {
          className: 'green-shadow-card text-black',
          duration: 3000,
          style: {
            background: '#ffffff',
            color: 'green',
            fontSize: '16px',
            border: '0px',
            padding: '1.5rem',
            boxShadow: '0px 4px 4px 3px rgba(48, 123, 116, 0.40)',
          },
        },
      );
      console.log(payload);
      setValidateError(null);
      setSelectedDates([]);
      setRoomNumber(null);
    } catch (error) {
      console.log('Error: ', error);
      toast.error('Failed to request session. Please try again later.', {
        className: 'green-shadow-card text-black',
        duration: 3000,
        style: {
          background: '#ffffff',
          color: 'red',
          fontSize: '16px',
          border: '0px',
          padding: '1.5rem',
          boxShadow: '0px 4px 4px 3px rgba(48, 123, 116, 0.40)',
        },
      });
    } finally {
      setValidateError(null);
      setRoomNumber(null);
      setSelectedDates([]);
      setSelectedTopics([]);
      setSelectedTopicID([]);
      setSelectedModality('online');
      setRequestLoading(false);
    }
  };

  if (loading) {
    return <TutorLoadingSkeleton />;
  }

  if (error || !tutor) {
    return <TutorErrorState error={error} />;
  }

  return (
    <section className="grid relative top-[5vh] items-center justify-center px-5 w-full">
      <form
        className="flex flex-col bg-ilc-tutor-card p-5 gap-5 rounded-2xl mx-auto md:w-[60%] lg:w-[100%] w-full green-shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          handleRequestSession();
        }}
      >
        <TutorCard
          name={tutor.name || 'Guest'}
          subject={safeJoin(tutor.subject)}
          available={safeJoin(tutor.availability)}
          expertise={safeJoin(tutor.expertise)}
          className="bg-white"
        />
        <div
          className="flex flex-col gap-4 rounded-xl bg-ilc-green p-5 text-white"
          style={{ boxShadow: '0px 4px 4px rgba(48, 123, 116, 0.3)' }}
        >
          <p className="text-xl font-thin">Hi, I'm {tutor?.name ?? 'Guest'}!</p>
          <p>{tutor?.description}</p>
        </div>
        <div className="grid gap-5">
          <p className="text-xl font-semibold">Select Date</p>
          <div className="flex flex-col items-center gap-4">
            <DropdownDatesAvail
              dates={[
                [
                  safeJoin(tutor.availability, ','),
                  safeJoin(tutor.available_time_from, ','),
                  safeJoin(tutor.available_time_to, ','),
                ],
              ]}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              className="mx-auto"
            />
            {selectedDates[0] && (
              <div className="text-sm text-gray-700 flex flex-col gap-2">
                {(() => {
                  const [date, from, to] = selectedDates[0].split('|');
                  return (
                    <div className="flex items-center gap-2">
                      <Check className="text-ilc-yellow" />
                      <p>
                        {date} - {from} to {to}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <p className="text-xl font-semibold">Select Topic</p>
          {/* DROPDOWN TOPICS */}
          <div className="flex flex-col items-center gap-4">
            <DropdownTopicsAvail
              topics={
                tutor?.topic_title?.map((title, index) => [
                  title,
                  tutor.topic_id?.[index] ?? title,
                ]) || []
              }
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
              setSelectedTopicID={setSelectedTopicID}
              className="mx-auto"
              selectedTopicID={[]}
            />
            {selectedTopics[0] && (
              <div className="text-sm text-gray-700 flex flex-col gap-2">
                {(() => {
                  return (
                    <div className="flex items-center gap-2">
                      <Check className="text-ilc-yellow" />
                      <p>
                        {selectedTopics.length > 0
                          ? selectedTopics
                          : 'No topic selected'}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-10">
          {/* IF MODALITY IS IN-PERSON, THEN SHOW INPUT ROOM NUMBER. ELSE HIDE */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p>Select Modality:</p>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="online"
                  name="modality"
                  value="online"
                  defaultChecked
                  onChange={handleModalityChange}
                />
                <label htmlFor="online">Online</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="in-person"
                  name="modality"
                  value="in-person"
                  onChange={handleModalityChange}
                />
                <label htmlFor="in-person">In-Person</label>
              </div>
            </div>
            {selectedModality === 'in-person' && (
              <>
                {/* INPUT ROOM NUMBER IF ONLINE */}
                <div className="flex justify-between items-center">
                  <label htmlFor="roomNumber">Room number:</label>
                  <Input
                    type="text"
                    id="roomNumber"
                    name="roomNumber"
                    placeholder="Input room number"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mx-auto">
            <Button variant={'yellow-button'} type="submit">
              {requestLoading ? (
                <>
                  <div className="flex gap-2 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    <p>Requesting Session...</p>
                  </div>
                </>
              ) : (
                'BOOK SESSION'
              )}
            </Button>
          </div>
          {validateError && (
            <div className="text-red-500 text-sm text-center">
              {validateError}
            </div>
          )}
          {}
        </div>
      </form>
    </section>
  );
};

export default IndividualTutor;

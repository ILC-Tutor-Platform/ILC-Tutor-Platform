import { DropdownDatesAvail } from '@/components/DropdownDatesAvail';
import { TutorErrorState } from '@/components/TutorErrorState';
import { TutorLoadingSkeleton } from '@/components/TutorLoadingSkeleton';
import TutorCard from '@/components/ui/TutorCard';
import { Button } from '@/components/ui/button';
import type { TutorDetail } from '@/types';
import { api } from '@/utils/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const IndividualTutor = () => {
  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { tutor_id } = useParams<{ tutor_id: string }>();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!tutor_id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/tutors/${tutor_id}`);
        const tutorData = response.data;

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
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchTutor();
  }, [tutor_id]);

  if (loading) {
    return <TutorLoadingSkeleton />;
  }

  if (error || !tutor) {
    return <TutorErrorState error={error} />;
  }

  return (
    <section className="grid relative top-[10vh] items-center justify-center px-5 w-full">
      <div
        className="flex flex-col bg-ilc-tutor-card p-5 gap-5 rounded-2xl mx-auto md:w-[60%] xl:w-[100%] w-full"
        style={{ boxShadow: '0px 4px 4px rgba(48, 123, 116, 0.3)' }}
      >
        <TutorCard
          name={tutor.name || 'Guest'}
          subject={tutor.subject?.join(', ') || 'Not specified'}
          available={tutor.availability?.join(', ') || 'Not specified'}
          expertise={tutor.expertise?.join(', ') || 'Not specified'}
          className="bg-white"
        />
        <div
          className="flex flex-col gap-4 rounded-xl bg-ilc-green p-5 text-white"
          style={{ boxShadow: '0px 4px 4px rgba(48, 123, 116, 0.3)' }}
        >
          <p className="text-2xl">Hi, I'm {tutor?.name ?? 'Guest'}!</p>
          <p>{tutor?.description}</p>
        </div>
        <div className="grid gap-5">
          <p className="text-2xl font-bold">Select Date</p>
          <div className="mx-auto">
            <DropdownDatesAvail
              dates={[
                [
                  tutor.availability.join(','),
                  tutor.available_time_from.join(','),
                  tutor.available_time_to.join(','),
                ],
              ]}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
            />
          </div>
        </div>
        <div className="mx-auto">
          <Button variant={'yellow-button'}>BOOK A SESSION</Button>
        </div>
      </div>
    </section>
  );
};

export default IndividualTutor;

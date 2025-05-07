import TutorCard from '@/components/ui/TutorCard';
import { useNavigate } from 'react-router-dom';

const tutors = [
  {
    id: '1',
    name: 'errol',
    subject: 'Subject/s',
    available: 'Dates Available',
    expertise: 'Expertise',
  },
  {
    id: '2',
    name: 'dave',
    subject: 'Subject/s',
    available: 'Dates Available',
    expertise: 'Expertise',
  },
  {
    id: '3',
    name: 'laurence',
    subject: 'Subject/s',
    available: 'Dates Available',
    expertise: 'Expertise',
  },
  {
    id: '4',
    name: 'trixie',
    subject: 'Subject/s',
    available: 'Dates Available',
    expertise: 'Expertise',
  },
  {
    id: '5',
    name: 'nicole',
    subject: 'Subject/s',
    available: 'Dates Available',
    expertise: 'Expertise',
  },
  {
    id: '6',
    name: 'dagohoy',
    subject: 'Subject/s',
    available: 'Dates Available',
    expertise: 'Expertise',
  },
];

const Tutors = () => {
  const navigate = useNavigate();
  const handleTutorClick = (tutorName: string) => {
    console.log(`Tutor with ID ${tutorName} clicked`);
    navigate(`/tutors/${tutorName}`);
  };
  return (
    <section className="flex flex-col gap-10 px-5 xl:px-40 relative top-[2vh]">
      <h2 className="text-6xl md:text-[64px] text-ilc-red font-bold">
        Tutor List
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
        {tutors.map((tutor) => {
          return (
            <TutorCard
              key={tutor.id}
              name={tutor.name}
              subject={tutor.subject}
              available={tutor.available}
              expertise={tutor.expertise}
              className="mx-auto"
              onClick={() => handleTutorClick(tutor.name)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Tutors;

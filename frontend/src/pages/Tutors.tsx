import { TutorCardLoadingSkeleton } from '@/components/TutorLoadingSkeleton';
import { Button } from '@/components/ui/button';
import TutorCard from '@/components/ui/TutorCard';
import type { TutorDetail, TutorResponse } from '@/types';
import { api } from '@/utils/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Tutors = () => {
  const [tutors, setTutors] = useState<TutorDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchTutors = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get<TutorResponse>(
        `/tutors?page=${pageNum}&limit=10`,
      );
      console.log(response.data);

      setTutors(response.data.tutors);

      setTotalPages(Math.ceil(response.data.total / response.data.limit));
      setPage(response.data.page);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleTutorClick = (tutor: TutorDetail) => {
    console.log(`Tutor with ID ${tutor.userid} clicked`);
    navigate(`/tutors/${tutor.userid}`);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchTutors(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchTutors(page - 1);
    }
  };

  const getAvailability = (tutor: TutorDetail) => {
    if (tutor.availability && tutor.availability.length > 0) {
      return tutor.availability[0];
    }
    return 'Not specified';
  };

  return (
    <section className="flex flex-col gap-10 px-5 xl:px-40 relative top-[2vh] min-h-screen">
      <h2 className="text-6xl md:text-[64px] text-ilc-red font-bold text-center md:text-left">
        Tutor List
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <TutorCardLoadingSkeleton key={i} />
            ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <TutorCard
                  key={tutor.userid}
                  name={tutor.name}
                  subject={tutor.subject}
                  available={getAvailability(tutor)}
                  expertise={tutor.expertise.join(', ')}
                  className="mx-auto"
                  onClick={() => handleTutorClick(tutor)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                No tutors found
              </div>
            )}
          </div>

          {/* Pagination controls */}
          {tutors.length > 0 && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={handlePrevPage}
                disabled={page <= 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Tutors;

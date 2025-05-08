import { useEffect, useState } from 'react';
import EditIcon from '../assets/edit.svg';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.svg';
import BadgeIcon from '../assets/user2.svg';

const TutorProfile = () => {
  const [, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(false);
    const navbar = document.querySelector("nav");
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = "0rem";
    }
    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = '0rem';
      }
    };
  }, []);

  const handleEditClick = (section: string) => {
    console.log(`Edit ${section} clicked`);
  };

  return (
    <div className="min-h-screen font-manrope relative flex">
      <div
        className="transition-all duration-300 ease-in-out flex-1"
      >
        <main className="p-4 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-5rem)]">
          <div
            className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6"
            style={{
              color: '#8A1538',
              fontFamily: 'Montserrat',
              fontWeight: 700,
              wordWrap: 'break-word',
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
              <div className="text-white text-xs md:text-sm lg:text-base xl:text-lg font-bold font-montserrat break-words">
                Tutor
              </div>
            </div>
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] shadow-md rounded-2xl border border-black border-opacity-30 p-4 md:p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex flex-col items-center mb-8">
              <img
                className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52"
                src={ProfilePlaceholder}
                alt="Profile"
              />

              <button
                className="mt-3 text-center text-base md:text-lg lg:text-xl text-black font-normal underline bg-none border-none cursor-pointer"
                onClick={() => {
                  console.log('Update Photo clicked');
                }}
              >
                Update Photo
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 flex-wrap justify-center w-full">
              <div className="flex-1 min-w-[17rem] max-w-[30rem] h-[15rem] md:min-w-[20rem] md:max-w-[32rem] md:h-[16rem] bg-white shadow-lg rounded-lg border border-opacity-10 relative">
                <button
                  className="absolute top-2 right-2 bg-none border-none cursor-pointer"
                  onClick={() => handleEditClick('left section')}
                >
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </button>
              </div>

              <div className="flex-1 min-w-[17rem] max-w-[30rem] h-[15rem] md:min-w-[20rem] md:max-w-[32rem] md:h-[16rem] bg-white shadow-lg rounded-lg border border-opacity-10 relative">
                <button
                  className="absolute top-2 right-2 bg-none border-none cursor-pointer"
                  onClick={() => handleEditClick('right section')}
                >
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorProfile;

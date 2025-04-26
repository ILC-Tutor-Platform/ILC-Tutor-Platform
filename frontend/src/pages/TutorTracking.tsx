import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import TutorCard from "../components/ui/TutorCard";

// Placeholder tutor data for demo
const tutors = [
  { id: 1, name: "Name", subject: "Subject/s" },
  { id: 2, name: "Name", subject: "Subject/s" },
  { id: 3, name: "Name", subject: "Subject/s" },
];

const TutorTracking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 7 : 0;

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = sidebarOpen
        ? `${sidebarWidth}rem`
        : "0rem";
    }

    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = "0rem";
      }
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen font-manrope flex relative">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className="transition-all duration-300 ease-in-out flex-1"
        style={{ marginLeft: `${sidebarWidth}rem` }}
      >
        <main className="p-4 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-5rem)]">
          <div
            style={{
              color: "#8A1538",
              fontFamily: "Montserrat",
              fontWeight: "700",
              wordWrap: "break-word",
              marginBottom: "1.5rem",
            }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            My Tutor
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] shadow-md border border-black/30 rounded-2xl p-4 md:p-6 lg:p-8">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-6">
              {tutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  name={tutor.name}
                  subject={tutor.subject}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="mt-4 w-2/5 md:w-1/4 lg:w-1/5 h-10 bg-[#307B74] rounded-[1rem] text-white text-base md:text-lg lg:text-xl font-montserrat font-bold break-words cursor-pointer">
                Browse Tutors
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorTracking;

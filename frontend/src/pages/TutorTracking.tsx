import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import TutorCard from "../components/ui/TutorCard";

// Placeholder tutor data for demonstration
const tutors = [
  { id: 1, name: "Name", subject: "Subject/s", available: "Dates Available", expertise: "Expertise" },
  { id: 2, name: "Name", subject: "Subject/s", available: "Dates Available", expertise: "Expertise" },
  { id: 3, name: "Name", subject: "Subject/s", available: "Dates Available", expertise: "Expertise" },
];

const TutorTracking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 112 : 0;

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = sidebarOpen
        ? `${sidebarWidth}px`
        : "0px";
    }

    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = "0px";
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
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <main className="p-10 min-h-[calc(100vh-80px)]">
          <div
            style={{
              color: "#8A1538",
              fontSize: 64,
              fontFamily: "Montserrat",
              fontWeight: "700",
              wordWrap: "break-word",
              marginBottom: "24px",
            }}
          >
            My Tutor
          </div>

          <div className="w-full min-h-[calc(100vh-180px)] bg-[#F9F8F4] shadow-md border border-black/30 rounded-2xl p-6">
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {tutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  name={tutor.name}
                  subject={tutor.subject}
                  available={tutor.available}
                  expertise={tutor.expertise}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="mt-5 w-1/5 h-10 bg-[#307B74] rounded-[15px] text-white text-[17px] font-montserrat font-bold break-words cursor-pointer">
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

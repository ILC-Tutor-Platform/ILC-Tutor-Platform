import { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import ProfilePlaceholder from "../assets/ProfilePlaceholder.svg";
import BadgeIcon from "../assets/user2.svg";
import EditIcon from "../assets/edit.svg";

const StudentDashboardProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 112 : 0;

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = sidebarOpen
        ? `${sidebarWidth}px`
        : "0px";
    }

    // Clean up margin when component unmounts
    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = "0px";
      }
    };
  }, [sidebarOpen]);

  const handleEditClick = (section: string) => {
    console.log(`Edit ${section} clicked`);
  };

  return (
    <div className="min-h-screen font-manrope relative flex">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className="transition-all duration-300 ease-in-out flex-1"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <main className="p-10 min-h-[calc(100vh-80px)]">
          <div className="flex items-center gap-4 mb-5">
            <div className="profile-header">My Profile</div>

            <div className="pl-4 pr-4 pt-2 pb-2 bg-[#307B74] rounded-xl flex items-center gap-2">
              <img className="w-6 h-6" src={BadgeIcon} alt="badge icon" />
              <div className="text-white text-sm font-bold font-montserrat break-words">
                Student
              </div>
            </div>
          </div>

          <div className="w-full min-h-[calc(100vh-180px)] bg-[#F9F8F4] shadow-md rounded-2xl border border-black border-opacity-30 p-6 flex flex-col gap-6">
            <div className="flex flex-col items-center mb-8">
              <img
                className="w-52 h-52"
                src={ProfilePlaceholder}
                alt="Profile"
              />

              <button
                className="mt-3 text-center text-black text-lg font-normal underline bg-none border-none cursor-pointer"
                onClick={() => {
                  console.log("Update Photo clicked");
                }}
              >
                Update Photo
              </button>
            </div>

            <div className="flex gap-8 flex-wrap justify-center w-full">
              <div className="flex-1 min-w-[280px] max-w-[500px] h-[250px] bg-white shadow-lg rounded-lg border border-opacity-10 relative">
                <button
                  className="absolute top-2 right-2 bg-none border-none cursor-pointer"
                  onClick={() => handleEditClick("left section")}
                >
                  <img src={EditIcon} alt="Edit" className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 min-w-[280px] max-w-[500px] h-[250px] bg-white shadow-lg rounded-lg border border-opacity-10 relative">
                <button
                  className="absolute top-2 right-2 bg-none border-none cursor-pointer"
                  onClick={() => handleEditClick("right section")}
                >
                  <img src={EditIcon} alt="Edit" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardProfile;

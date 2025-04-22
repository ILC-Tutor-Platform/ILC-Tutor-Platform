import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import BadgeIcon from "../assets/user2.svg";

const StudentAnnouncements = () => {
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
          <div
            className="flex items-center gap-4 mb-5"
            style={{
              color: "#8A1538",
              fontSize: 64,
              fontFamily: "Montserrat",
              fontWeight: 700,
              wordWrap: "break-word",
            }}
          >
            Announcements
          </div>

          <div className="w-full min-h-[calc(100vh-180px)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[20px] p-6 shadow-md">
            <div className="w-full h-full bg-white border border-[#FF9D02] rounded-[20px] p-6 mb-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="text-sm text-gray-600 mb-2">April 1, 2025</p>
              <p className="text-lg font-bold text-black mb-1 font-manrope">
                AralLink Update
              </p>
              <p className="text-sm text-gray-800 font-manrope">
                (Description)
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentAnnouncements;

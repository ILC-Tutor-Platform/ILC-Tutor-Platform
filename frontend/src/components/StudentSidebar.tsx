import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebarStore } from "@/stores/sidebarStore";
import Profile from "../assets/user.svg";
import Tutor from "../assets/coach.svg";
import Schedule from "../assets/calendar.svg";
import Announcements from "../assets/megaphone.svg";
import { Menu } from "lucide-react";

const StudentSidebar = () => {
  const { isOpen, close } = useSidebarStore(); // 👈 get state from Zustand store
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isOpen ? (isMobile ? "7rem" : "7rem") : "0rem";

  return (
    <aside
      className="fixed min-h-screen top-0 left-0 bg-[#F9F8F4] border-r border-black/30 transition-all duration-300 ease-in-out flex flex-col items-center"
      style={{ width: sidebarWidth }}
    >
      {isOpen && (
        <>
          <Menu
            className="absolute top-6 cursor-pointer"
            onClick={close}
          />
          <div className="flex flex-col justify-center items-center gap-8 mt-24">
            {[
              { label: "Profile", icon: Profile, route: "/profile/student" },
              { label: "Tutor", icon: Tutor, route: "/student/tutor-tracking" },
              {
                label: "Schedule",
                icon: Schedule,
                route: "/student/schedule-tracking",
              },
              {
                label: "Announcements",
                icon: Announcements,
                route: "/student/announcements",
                large: true,
              },
            ].map((item) => (
              <Link
                to={item.route}
                key={item.label}
                className="w-full"
                onClick={close}
              >
                <button className="flex flex-col items-center gap-2 w-full text-black hover:text-[#307B74] transition-colors">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={item.large ? "w-6 h-6" : "w-5 h-5"}
                  />
                  <span
                    className={`${
                      item.large ? "text-xs" : "text-sm"
                    } font-medium text-center`}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default StudentSidebar;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Profile from "../assets/user.svg";
import Tutor from "../assets/coach.svg";
import Schedule from "../assets/calendar.svg";
import Announcements from "../assets/megaphone.svg";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Menu } from "lucide-react";

const TutorSidebar = () => {
  const { isOpen, toggle } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isOpen ? (isMobile ? "7rem" : "8rem") : "0rem";

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-50 bg-[#F9F8F4] border-r border-black/30 transition-all duration-300 ease-in-out flex flex-col items-center"
      style={{ width: sidebarWidth }}
    >
      {isOpen && (
        <>
          <Menu
            className="absolute top-10 cursor-pointer"
            onClick={toggle}
            width={32}
            height={32}
          />
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
          {[
            { label: "Profile", icon: Profile, route: "/profile/tutor" },
            {
              label: "Students",
              icon: Tutor,
              route: "/profile/tutor/student-tracking",
            },
            {
              label: "Schedule",
              icon: Schedule,
              route: "/profile/tutor/schedule",
            },
            {
              label: "Announcements",
              icon: Announcements,
              route: "/profile/tutor/announcements",
              large: true,
            },
          ].map((item) => (
            <Link to={item.route} key={item.label} className="w-full">
              <button className="flex flex-col items-center gap-2 w-full text-black hover:text-[#307B74] transition-colors">
                <img
                  src={item.icon}
                  alt={item.label}
                  className={item.large ? "w-6 h-6" : "w-5 h-5"}
                  onClick={toggle}
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

export default TutorSidebar;
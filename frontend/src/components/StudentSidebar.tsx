import { Link } from "react-router-dom";
import Profile from "../assets/user.svg";
import Tutor from "../assets/coach.svg";
import Schedule from "../assets/calendar.svg";
import Announcements from "../assets/megaphone.svg";
import { useState } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const StudentSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const sidebarWidth = sidebarOpen ? 112 : 0;

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-50 bg-[#F9F8F4] border-r border-black/30 transition-all duration-300 ease-in-out flex flex-col items-center"
      style={{ width: `${sidebarWidth}px` }}
    >
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-11 left-10 cursor-pointer"
      >
        <div className="w-6 h-1 bg-black mb-1" />
        <div className="w-6 h-1 bg-black mb-1" />
        <div className="w-6 h-1 bg-black" />
      </div>

      {sidebarOpen && (
        <div className="flex flex-col justify-center items-center flex-1 gap-8 mt-[80px]">
          {[
            { label: "Profile", icon: Profile, route: "/profile" },
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
            <Link to={item.route} key={item.label} className="w-full">
              <button
                className="flex flex-col items-center gap-2 w-full text-black hover:text-[#307B74] transition-colors"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`${item.large ? "w-6 h-6" : "w-5 h-5"}`}
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
      )}
    </aside>
  );
};

export default StudentSidebar;

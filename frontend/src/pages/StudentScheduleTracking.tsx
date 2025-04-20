import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";

interface Schedule {
  student: string;
  datetime: string;
  subject: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

const ScheduleTracking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]); // for future backend data
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

  useEffect(() => {
    // Mock data
    const mockData: Schedule[] = [
      {
        student: "Name",
        datetime: "Date & Time",
        subject: "Subject",
        status: "DECLINED",
      },
      {
        student: "Name",
        datetime: "Date & Time",
        subject: "Subject",
        status: "APPROVED",
      },
      {
        student: "Name",
        datetime: "Date & Time",
        subject: "Subject",
        status: "PENDING",
      },
    ];

    setSchedules(mockData);
  }, []);

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
            <div className="profile-header">My Schedule</div>
            <button className="see-history-button">See History</button>
          </div>

          <div
            className="schedule-table-container"
            style={{
              width: "100%",
              minHeight: "calc(100vh - 180px)",
              background: "#F9F8F4",
              boxShadow: "0px 5px 3.8px rgba(48, 123, 116, 0.40)",
              borderRadius: 20,
              border: "0.30px black solid",
              padding: "24px",
              boxSizing: "border-box",
            }}
          >
            <div className="w-full">
              {/* Header Row */}
              <div className="grid grid-cols-4 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center">
                <div>Student</div>
                <div>Date & Time</div>
                <div>Subject</div>
                <div>Status</div>
              </div>

              {/* Dynamic Rows */}
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-3 mt-2 text-center"
                >
                  <div>{schedule.student}</div>
                  <div>{schedule.datetime}</div>
                  <div>{schedule.subject}</div>
                  <div>
                    <span
                      className={`border text-xs px-3 py-1 rounded-full ${
                        schedule.status === "APPROVED"
                          ? "border-[#307B74] text-[#307B74]"
                          : schedule.status === "DECLINED"
                          ? "border-[#8A1538] text-[#8A1538]"
                          : "border-gray-400 text-gray-500"
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduleTracking;

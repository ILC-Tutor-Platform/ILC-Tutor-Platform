import { useEffect, useState } from "react";

interface Schedule {
  tutor: string;
  datetime: string;
  subject: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

const StudentScheduleTracking = () => {
  const [, setSidebarOpen] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    setSidebarOpen(false); // close on mount
    const navbar = document.querySelector("nav");
    if (navbar) {
      (navbar as HTMLElement).style.marginLeft = "0rem";
    }
    return () => {
      if (navbar) {
        (navbar as HTMLElement).style.marginLeft = "0rem";
      }
    };
  }, []);

  useEffect(() => {
    const mockData: Schedule[] = [
      {
        tutor: "Name",
        datetime: "Date & Time",
        subject: "Subject",
        status: "DECLINED",
      },
      {
        tutor: "Name",
        datetime: "Date & Time",
        subject: "Subject",
        status: "APPROVED",
      },
      {
        tutor: "Name",
        datetime: "Date & Time",
        subject: "Subject",
        status: "PENDING",
      },
    ];
    setSchedules(mockData);
  }, []);

  return (
    <div className="min-h-screen font-manrope relative flex">

      <div
        className="transition-all duration-300 ease-in-out flex-1"
      >
        <main className="p-4 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-5rem)]">
          <div
            className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6"
            style={{
              color: "#8A1538",
              fontFamily: "Montserrat",
              fontWeight: 700,
              wordWrap: "break-word",
              fontSize: "2rem",
            }}
          >
            <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              My Schedule
            </span>
            <button className="see-history-button text-sm sm:text-base md:text-base lg:text-lg xl:text-xl">
              See History
            </button>
          </div>

          <div className="w-full min-h-[calc(100vh-10rem)] bg-[#F9F8F4] border border-black border-opacity-30 rounded-[1.25rem] p-4 md:p-6 lg:p-8 xl:p-10 shadow-md">
            <div className="w-full">
              <div className="grid grid-cols-4 font-semibold text-white bg-[#8A1538] rounded-md px-4 py-3 text-center text-xs sm:text-sm md:text-base">
                <div>Tutor</div>
                <div>Date & Time</div>
                <div>Subject</div>
                <div>Status</div>
              </div>

              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-3 mt-2 text-center text-xs sm:text-sm md:text-base"
                >
                  <div>{schedule.tutor}</div>
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

export default StudentScheduleTracking;

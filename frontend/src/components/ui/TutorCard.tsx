import { FaCalendarAlt, FaBriefcase } from "react-icons/fa";

interface TutorCardProps {
  name: string;
  subject: string;
  available: string;
  expertise: string;
}

const TutorCard = ({ name, subject, available, expertise }: TutorCardProps) => {
  return (
    <div
      className="w-full sm:w-[48%] lg:w-[30%] min-w-[250px] bg-white rounded-[15px] p-5 shadow-md flex flex-col gap-3 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
      style={{ boxShadow: "0px 4px 4px rgba(48, 123, 116, 0.3)" }}
    >
      {/* Profile + Name */}
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-full bg-[#F2F2F2] border border-gray-300" />
        <div className="text-xl font-semibold text-gray-600">{name}</div>
      </div>

      {/* Subject Button */}
      <button
        className="text-white font-semibold text-sm rounded-full px-4 py-1"
        style={{ backgroundColor: "#FF9D02" }}
      >
        {subject}
      </button>

      {/* Icons and Info */}
      <div className="flex items-center gap-2 text-gray-500">
        <FaCalendarAlt />
        <span>{available}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <FaBriefcase />
        <span>{expertise}</span>
      </div>
    </div>
  );
};

export default TutorCard;

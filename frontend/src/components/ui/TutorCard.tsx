import { FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TutorCardProps {
  name: string;
  subject: string;
  available: string;
  expertise: string;
  className?: string;
  onClick?: () => void;
}

const TutorCard = ({
  name,
  subject,
  available,
  expertise,
  className,
  onClick,
}: TutorCardProps) => {
  return (
    <div
      className={`bg-ilc-tutor-card mx-auto w-full md:w-[90%] lg:w-full rounded-[15px] p-5 shadow-md flex flex-col gap-3 transform transition-transform duration-300 hover:scale-105 cursor-pointer ${
        className || ""
      }`}
      style={{ boxShadow: "0px 4px 4px rgba(48, 123, 116, 0.3)" }}
      onClick={onClick}
    >
      {/* Profile + Name */}
      <div className="flex items-center gap-4">
        <Avatar className="w-[2.5rem] h-[2.5rem]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="md:text-xl font-semibold text-gray-600">{name}</div>
      </div>

      {/* Subject Button */}
      <Button variant="yellow-button">{subject}</Button>

      {/* Icons and Info */}
      <div className="flex items-center gap-2 text-gray-500">
        <FaCalendarAlt />
        <p className="text-xs">{available}</p>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <FaBriefcase />
        <p className="text-xs">{expertise}</p>
      </div>
    </div>
  );
};

export default TutorCard;

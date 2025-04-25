import { useParams } from "react-router-dom";
import TutorCard from "@/components/ui/TutorCard";
import { Button } from "@/components/ui/button";
import { DropdownDatesAvail } from "@/components/DropdownDatesAvail";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const sampleTutor = {
  name: "baby q",
  subject: "Pababy 101",
  available: "Available on Mondays and Wednesdays",
  expertise: "Expert in baby care",
};

const tutorDesc = {
  name: "baby q",
  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.",
};

const IndividualTutor = () => {
  const params = useParams<{ tutorName: string }>();
  const { tutorName } = params;
  console.log(tutorName);
  scrollToTop();
  return (
    <section className="grid relative top-[10vh] items-center justify-center px-5 w-full">
      <div
        className="flex flex-col bg-ilc-tutor-card p-5 gap-5 rounded-2xl mx-auto md:w-[60%] xl:w-[50%]"
        style={{ boxShadow: "0px 4px 4px rgba(48, 123, 116, 0.3)" }}
      >
        <TutorCard
          name={tutorName ?? "baby q"}
          subject={sampleTutor.subject}
          available={sampleTutor.available}
          expertise={sampleTutor.expertise}
          className="bg-white"
        />
        <div
          className="flex flex-col gap-4 rounded-xl bg-ilc-green p-5 text-white"
          style={{ boxShadow: "0px 4px 4px rgba(48, 123, 116, 0.3)" }}
        >
          <p className="text-2xl">Hi, I'm {tutorName ?? "Guest"}!</p>
          <p>{tutorDesc.desc}</p>
        </div>
        <div className="grid gap-5">
          <p className="text-2xl font-bold">Select Date</p>
          <div className="mx-auto">
            <DropdownDatesAvail />
          </div>
        </div>
        <div className="mx-auto">
          <Button variant={"yellow-button"}>BOOK A SESSION</Button>
        </div>
      </div>
    </section>
  );
};

export default IndividualTutor;

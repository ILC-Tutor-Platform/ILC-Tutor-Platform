import Logo from "@/assets/AralLinkLogo.svg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-clip h-screen">
      {/* BOOKS BG ELEMENTS */}
      <div className="absolute top-[33%] left-[10%] md:top-[15%] md:left-[30%] w-[85%] h-[85%] bg-[url('/src/assets/books.svg')] bg-no-repeat bg-center bg-contain" />

      {/* HERO */}
      <div className="absolute flex flex-col gap-8 md:gap-15 left-[10%] top-[10%]">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl lg:text-[5.5rem] font-bold">Welcome to</h1>
          <img src={Logo} alt="" className="w-[14rem] lg:w-sm h-auto" />
        </div>

        <p className="w-[80%] md:w-[45%] xl:text-xl xl:w-1/4">
          AralLink is the Interactive Learning Center's official platform for
          connecting students with tutors and booking academic support
          sessions—all in one place.
        </p>

        <div>
          <Button
            variant={"yellow-button-outline"}
            className="px-10 py-5 md:py-7 md:text-xl font-bold rounded-3xl"
            onClick={() => navigate("/tutors")}
          >
            BROWSE TUTORS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Home;

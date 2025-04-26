import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { useState, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200); // Delay in ms before closing
  };

  return (
    <nav className="flex items-center justify-between px-20 py-7 shadow-md sticky top-0 bg-white z-50">
      <NavLink to={"/"}>
        <img src={Logo} alt="Logo" className="w-35 h-auto" />
      </NavLink>

      <ul className="flex gap-10 items-center relative">
        <li>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive
                ? "text-ilc-yellow underline underline-offset-[15px]"
                : "hover:text-ilc-yellow underline-offset-[15px] hover:underline"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/tutors"}
            className={({ isActive }) =>
              isActive
                ? "text-ilc-yellow underline underline-offset-[15px]"
                : "hover:text-ilc-yellow underline-offset-[15px] hover:underline"
            }
          >
            Tutor
          </NavLink>
        </li>

        {/* Profile with Dropdown */}
        <li
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="cursor-pointer hover:text-ilc-yellow underline-offset-[15px] hover:underline">
            Profile
          </span>

          {isDropdownOpen && (
            <div className="absolute top-8 right-0 bg-white shadow-md rounded-md border w-40 z-10">
              <NavLink
                to="/profile/student"
                className="block px-4 py-2 hover:bg-ilc-yellow hover:text-white"
              >
                Student
              </NavLink>
              <NavLink
                to="/profile/tutor"
                className="block px-4 py-2 hover:bg-ilc-yellow hover:text-white"
              >
                Tutor
              </NavLink>
            </div>
          )}
        </li>

        <li className="border-[2px] border-gray-300 border-dashed">
          <Button
            variant={"yellow-button"}
            size={"navbar-size"}
            onClick={() => navigate("/signin")}
          >
            LOG OUT
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

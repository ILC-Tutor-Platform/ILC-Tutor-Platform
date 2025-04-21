import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-20 py-7 shadow-md sticky top-0 bg-white z-50">
      <NavLink to={"/"}>
        <img src={Logo} alt="Logo" className="w-35 h-auto" />
      </NavLink>

      <ul className="flex gap-10 items-center">
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
        <li>
          <NavLink
            to={"/profile"}
            className={({ isActive }) =>
              isActive
                ? "text-ilc-yellow underline underline-offset-[15px]"
                : "hover:text-ilc-yellow underline-offset-[15px] hover:underline"
            }
          >
            Profile
          </NavLink>
        </li>
        <li className="border-[2px] border-gray-300 border-dashed">
          <Button variant={"yellow-button"} size={"navbar-size"} onClick={() => navigate("/signin")}>
            LOG OUT
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
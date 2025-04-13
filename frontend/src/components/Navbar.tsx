import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/AralLinkLogo.svg";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-7 shadow-md sticky top-0">
      <Link to={"/"}>
        <img src={Logo} alt="Logo" className="w-35 h-auto" />
      </Link>

      <ul className="flex gap-10 items-center">
        <li>
          <Link to={"/"} className="hover:text-ilc-yellow underline-offset-[15px] hover:underline">Home</Link>
        </li>
        <li>
          <Link to={"/tutor"} className="hover:text-ilc-yellow underline-offset-[15px] hover:underline">Tutor</Link>
        </li>
        <li>
          <Link to={"/profile"} className="hover:text-ilc-yellow underline-offset-[15px] hover:underline">Profile</Link>
        </li>
        <li className="border-[2px] border-gray-300 border-dashed">
          <Button variant={"yellow-button"} size={'navbar-size'}>LOG OUT</Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

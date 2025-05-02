import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { useState, useRef } from "react";
import { UserAuth } from "@/context/AuthContext";
import StudentSidebar from "./StudentSidebar";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Menu } from "lucide-react";
import SessionLoading from "./Loading";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authContext = UserAuth();
  const { session, signOut } = authContext || {};
  const { toggle } = useSidebarStore();
  const [loading, setLoading] = useState(false);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      await new Promise((resolve) => setTimeout(resolve, 1200));
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <SessionLoading msg="Signing out" />
        </div>
      )}
      <nav className="flex items-center justify-between px-20 py-7 shadow-md sticky top-0 bg-white z-50">
        {session && (
          <span className="absolute left-7">
            <Menu
              className="cursor-pointer"
              onClick={toggle}
              width={32}
              height={32}
            />
            <StudentSidebar />
          </span>
        )}
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
              Tutors
            </NavLink>
          </li>

          {/* Profile with Dropdown */}
          {session && (
            <>
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
            </>
          )}

          <li className="border-[2px] border-gray-300 border-dashed">
            <Button
              variant={"yellow-button"}
              size={"navbar-size"}
              onClick={handleSignOut}
            >
              {session ? "Sign out" : "Sign in"}
            </Button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;

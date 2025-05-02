import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import StudentSidebar from "./StudentSidebar";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Menu } from "lucide-react";
import SessionLoading from "./Loading";
import TutorSidebar from "./TutorSidebar";

const Navbar = () => {
  const navigate = useNavigate();
  const authContext = UserAuth();
  const { session, signOut, user } = authContext || {};
  const { toggle } = useSidebarStore();
  const [loading, setLoading] = useState(false);

  let roles = user?.user_metadata?.role;
  const hasRole = (roles: number[], target: number) => roles.includes(target);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
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
            {hasRole(roles, 0) && <StudentSidebar />}
            {hasRole(roles, 1) && <TutorSidebar />}
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
              <li>
                {hasRole(roles, 0) && (
                  <NavLink
                    to={"/profile/student"}
                    className={({ isActive }) =>
                      isActive
                        ? "text-ilc-yellow underline underline-offset-[15px]"
                        : "hover:text-ilc-yellow underline-offset-[15px] hover:underline"
                    }
                  >
                    Profile
                  </NavLink>
                )}
                {hasRole(roles, 1) && (
                  <NavLink
                    to={"/profile/tutor"}
                    className={({ isActive }) =>
                      isActive
                        ? "text-ilc-yellow underline underline-offset-[15px]"
                        : "hover:text-ilc-yellow underline-offset-[15px] hover:underline"
                    }
                  >
                    Profile
                  </NavLink>
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

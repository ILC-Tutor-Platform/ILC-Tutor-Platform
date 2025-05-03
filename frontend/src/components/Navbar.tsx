import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/AralLinkLogo.svg";
import { useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import StudentSidebar from "./StudentSidebar";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Menu } from "lucide-react";
import TutorSidebar from "./TutorSidebar";
import { useRoleStore } from "@/stores/roleStore";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const authContext = UserAuth();
  const { session, signOut } = authContext || {};
  const { toggle } = useSidebarStore();
  const [loading, setLoading] = useState(false);
  const activeRole = useRoleStore((state) => state.activeRole);
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      useRoleStore.getState().clearRoles();
      console.log("User signed out successfully!");

      setTimeout(() => {
        setLoading(false);
        navigate("/signin");
        toast.success("Signed out successfully!", {
          duration: 3000,
          style: {
            backgroundColor: "#ffffff",
            color: "#307B74",
            fontSize: "16px",
            boxShadow: "0px 4px 4px 3px rgba(48, 123, 116, 0.40)",
          },
        });
      }, 500);
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
  };

  return (
    <nav className="flex items-center justify-between px-20 py-7 shadow-md sticky top-0 bg-white z-50">
      {session && (
        <span className="absolute left-7">
          <Menu
            className="cursor-pointer"
            onClick={toggle}
            width={32}
            height={32}
          />
          {activeRole === 0 && <StudentSidebar />}
          {activeRole === 1 && <TutorSidebar />}
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

        {session && (
          <li>
            {activeRole === 0 && (
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
            {activeRole === 1 && (
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
        )}

        <li className="border-[2px] border-gray-300 border-dashed">
          <Button
            variant={"yellow-button"}
            size={"navbar-size"}
            onClick={session ? handleSignOut : () => navigate("/signin")}
          >
            {session ? "Sign out" : "Sign in"}
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

import { useSidebarStore } from "@/stores/sidebarStore";
import { Button } from "./ui/button";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import bell from "@/assets/bell.svg";
import profile from "@/assets/profile.svg";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import StudentSidebar from "./StudentSidebar";
import logo from "@/assets/AralLinkLogo.svg";
import TutorSidebar from "./TutorSidebar";
import { toast } from "sonner";
import { useRoleStore } from "@/stores/roleStore";
import { useEffect, useState } from "react";

const NavbarMobile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut, refreshSession } = UserAuth();
  const { toggle, close } = useSidebarStore();
  const activeRole = useRoleStore((state) => state.activeRole);
  const [, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (isAuthenticated && user) {
        await refreshSession();
      }
      setSessionChecked(true);
    };

    checkSession();

    const refreshInterval = setInterval(
      () => {
        if (isAuthenticated) {
          refreshSession();
        }
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, refreshSession, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
      console.log("Signed out successfully!");
      toast.success("Signed out successfully!", {
        duration: 3000,
        style: {
          backgroundColor: "#ffffff",
          color: "#307B74",
          fontSize: "16px",
          boxShadow: "0px 4px 4px 3px rgba(48, 123, 116, 0.40)",
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center shadow-md sticky top-0 bg-white py-5 px-5 z-50">
        <div className="flex items-center gap-4">
          {isAuthenticated && user && (
            <span>
              <Menu className="cursor-pointer" onClick={toggle} />
              {activeRole === 0 && <StudentSidebar />}
              {activeRole === 1 && <TutorSidebar />}
            </span>
          )}
          <Link to={"/"} onClick={close}>
            <img src={logo} alt="" className="w-25 h-auto" />
          </Link>
        </div>

        <div>
          <ul className="flex items-center gap-4">
            {isAuthenticated && user && (
              <>
                <li>
                  {activeRole === 0 && (
                    <Link to={"/profile/student/announcements"}>
                      <img src={bell} alt="" />
                    </Link>
                  )}
                  {activeRole === 1 && (
                    <Link to={"/profile/tutor/announcements"}>
                      <img src={bell} alt="" />
                    </Link>
                  )}
                  {activeRole === 2 && (
                    <Link to={"/profile/admin/announcements"}>
                      <img src={bell} alt="" />
                    </Link>
                  )}
                </li>
                <li>
                  {activeRole === 0 && (
                    <Link to={"/profile/student"}>
                      <img src={profile} alt="" />
                    </Link>
                  )}
                  {activeRole === 1 && (
                    <Link to={"/profile/tutor"}>
                      <img src={profile} alt="" />
                    </Link>
                  )}
                  {activeRole === 2 && (
                    <Link to={"/profile/admin"}>
                      <img src={profile} alt="" />
                    </Link>
                  )}
                </li>
              </>
            )}
            {(!isAuthenticated || !user) && (
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
            )}
            <li className="border-[2px] border-gray-300 border-dashed">
              <Button
                onClick={() =>
                  isAuthenticated && user
                    ? handleSignOut()
                    : navigate("/signin")
                }
                variant={"yellow-button"}
                className="text-xs"
              >
                {isAuthenticated && user ? "Sign out" : "Sign in"}
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavbarMobile;

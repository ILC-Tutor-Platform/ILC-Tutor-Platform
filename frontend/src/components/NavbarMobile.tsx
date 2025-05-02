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

const NavbarMobile = () => {
  const navigate = useNavigate();
  const authContext = UserAuth();
  const { session, signOut, user } = authContext || {};
  const { toggle, close } = useSidebarStore();

  let roles = user?.user_metadata?.role;
  const hasRole = (roles: number[], target: number) => roles.includes(target);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center shadow-md sticky top-0 bg-white py-5 px-5 z-50">
        <div className="flex items-center gap-4">
          {session && (
            <span>
              <Menu className="cursor-pointer" onClick={toggle} />
              {hasRole(roles, 0) && <StudentSidebar />}
              {hasRole(roles, 1) && <TutorSidebar />}
            </span>
          )}
          <Link to={"/"} onClick={close}>
            <img src={logo} alt="" className="w-25 h-auto" />
          </Link>
        </div>

        <div>
          <ul className="flex items-center gap-4">
            {session && (
              <>
                <li>
                  {hasRole(roles, 0) && (
                    <Link to={"/profile/student/announcements"}>
                      <img src={bell} alt="" />
                    </Link>
                  )}
                  {hasRole(roles, 1) && (
                    <Link to={"/profile/tutor/announcements"}>
                      <img src={bell} alt="" />
                    </Link>
                  )}
                </li>
                <li>
                  {hasRole(roles, 0) && (
                    <Link to={"/profile/student"}>
                      <img src={profile} alt="" />
                    </Link>
                  )}
                  {hasRole(roles, 1) && (
                    <Link to={"/profile/tutor"}>
                      <img src={profile} alt="" />
                    </Link>
                  )}
                </li>
              </>
            )}
            {!session && (
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
                  session ? handleSignOut() : navigate("/signin")
                }
                variant={"yellow-button"}
                className="text-xs"
              >
                {session ? "Sign out" : "Sign in"}
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavbarMobile;

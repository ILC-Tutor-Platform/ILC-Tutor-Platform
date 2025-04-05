import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    console.log(session);

    const handleSignOut = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signOut();
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Welcome, {session?.user?.email}</h2>
            <div>
                <button className="hover:cursor-pointer" onClick={handleSignOut}>
                    Signout
                </button>
            </div>
        </div>
    )
}

export default Dashboard;
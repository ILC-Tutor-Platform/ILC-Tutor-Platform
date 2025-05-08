import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  console.log(user)

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {user?.name}</h2>
      <div>
        <button className="hover:cursor-pointer" onClick={handleSignOut}>
          Signout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

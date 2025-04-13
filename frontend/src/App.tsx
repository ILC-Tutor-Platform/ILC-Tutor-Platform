import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </main>
  );
}

export default App;

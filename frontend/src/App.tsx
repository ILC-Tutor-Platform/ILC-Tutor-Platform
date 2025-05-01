import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavbarMobile from "./components/NavbarMobile";
import Footer from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (e: {
      matches: boolean | ((prevState: boolean) => boolean);
    }) => setIsMobile(e.matches);

    // Attach listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <main>
      <ScrollToTop />
      {isMobile ? <NavbarMobile /> : <Navbar />}
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default App;

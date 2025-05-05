import { Link } from "react-router-dom";

const PageNotFound = () => {
  const pageNotFound = async () => {
    console.log(
      "404. PAGE NOT FOUND!"
    );
  };

  pageNotFound();
  return (
    <section className="grid justify-center min-h-screen w-full items-center">
      <div className="mx-auto p-20 green-shadow-card rounded-2xl text-center grid gap-4">
            <h1 className="text-3xl text-ilc-yellow">404</h1>
            <h2>PAGE NOT FOUND.</h2>
            <Link to="/" className="font-thin text-gray-600">Return to Home</Link>
      </div>
    </section>
  );
};
export default PageNotFound;

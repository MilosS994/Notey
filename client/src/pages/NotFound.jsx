import NotFoundImage from "../assets/notFound.png";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 cursor-default">
      <img
        src={NotFoundImage}
        alt="404 page not found"
        className="w-56 md:w-66 lg:w-86"
      />
      <p className="text-xs sm:text-sm md:text-md lg:text-lg text-black">
        Page not found
      </p>
      <Link
        to="/dashboard"
        className="text-sm sm:text-base md:text-lg lg:text-2xl text-black hover:text-gray-700"
      >
        Go back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;

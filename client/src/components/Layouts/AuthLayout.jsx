import Navbar from "../../components/Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-[100vh] w-[100%] bg-indigo-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex items-start justify-center mt-24 lg:justify-evenly">
        {children}

        {/* Logo */}
        <div>
          <h1 className="hidden lg:block text-[106px] font-bold text-shadow-md bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent cursor-default">
            notey.
          </h1>
          <p className="hidden lg:block text-right text-lg underline underline-offset-2 italic bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent text-shadow-sm cursor-default">
            Keeps your ideas alive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

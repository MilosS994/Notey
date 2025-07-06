const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center gap-16 lg:gap-32 bg-gradient-to-br from-slate-50 via-violet-50 to-slate-100 cursor-default">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        {children}
      </div>
      <h1 className="text-[4rem] lg:text-[6rem] font-bold py-4 px-6 hidden md:block bg-gradient-to-r from-green-400 via-blue-400 to-violet-400 bg-clip-text text-transparent drop-shadow-2xl">
        notey.
      </h1>
    </div>
  );
};

export default AuthLayout;

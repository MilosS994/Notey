import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import API_PATHS from "../../utils/apiPaths.js";

const Login = ({ setUser }) => {
  // State variables for input fields and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setServerError("");

    if (email.trim() === "") {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    }

    // Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      // Get token from the user in the response
      const { token } = response.data;

      // Store token in local storage
      if (token) {
        localStorage.setItem("token", token);
        const userInfo = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        setUser(userInfo.data);
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("An error occurred. Please try again later.");
      }
    }
  };
  return (
    <AuthLayout>
      <div className="w-[85%] md:w-[80%] lg:w-2/5 rounded-md p-5 shadow-lg bg-slate-100">
        <form onSubmit={handleLogin} className="flex flex-col">
          <h4 className="text-xl mb-5 font-semibold cursor-default md:text-2xl lg:text-3xl text-shadow-md">
            Login
          </h4>
          <div className="flex flex-col gap-2">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-gray-700 font-light text-xs md:text-sm lg:text-base"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@email.com"
                className="text-xs border border-gray-300 bg-neutral-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-tertiary md:text-sm lg:text-base"
                autoFocus
              />
              {emailError && (
                <p className="text-red-600 font-semibold text-xs md:text-sm lg:text-base cursor-default">
                  {emailError}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-gray-700 font-light text-xs md:text-sm lg:text-base"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="text-xs border border-gray-300 bg-neutral-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-tertiary md:text-sm lg:text-base"
              />
              {passwordError && (
                <p className="text-red-600 font-semibold text-xs md:text-sm lg:text-base cursor-default">
                  {passwordError}
                </p>
              )}
              {serverError && (
                <p className="text-red-600 font-semibold text-xs md:text-sm lg:text-base cursor-default">
                  {serverError}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="text-xs text-black font-semibold uppecras bg-tertiary py-1 rounded-md cursor-pointer shadow-md mt-4 hover:bg-secondary transition-all duration-200 md:py-2 md:text-sm lg:text-base"
          >
            Login
          </button>
          <p className="text-xs text-left mt-6 cursor-default md:text-sm lg:text-base">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="underline underline-offset-2 transition-all duration-200 md:text-sm lg:text-base text-blue-800 hover:text-blue-600"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>{" "}
    </AuthLayout>
  );
};

export default Login;

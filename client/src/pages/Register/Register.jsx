import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import API_PATHS from "../../utils/apiPaths.js";

const Register = () => {
  // State variables for form inputs and errors
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");

    // Validate inputs
    if (name.trim() === "") {
      setNameError("Name is required");
      return;
    }

    if (email.trim() === "") {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("You need to confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    // Register API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password,
      });

      // Get token from the user in the response
      const { token } = response.data;

      // Store token in local storage
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
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
        <form onSubmit={handleRegister} className="flex flex-col">
          <h4 className="text-xl mb-5 font-semibold cursor-default md:text-2xl lg:text-3xl text-shadow-md">
            Register
          </h4>
          <div className="flex flex-col gap-2">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-gray-700 font-light text-xs md:text-sm lg:text-base"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="text-xs border border-gray-300 bg-neutral-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-tertiary md:text-sm lg:text-base"
                autoFocus
              />
              {nameError && (
                <p className="text-red-600 font-semibold text-xs md:text-sm lg:text-base cursor-default">
                  {nameError}
                </p>
              )}
            </div>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="johndoe@email.com"
                className="text-xs border border-gray-300 bg-neutral-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-tertiary md:text-sm lg:text-base"
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
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-xs border border-gray-300 bg-neutral-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-tertiary md:text-sm lg:text-base w-full"
                />
                {passwordError && (
                  <p className="text-red-600 font-semibold text-xs md:text-sm lg:text-base cursor-default">
                    {passwordError}
                  </p>
                )}
                {showPassword ? (
                  <IoMdEyeOff
                    className="text-sm md:text-base lg:text-lg cursor-pointer hover:text-gray-700 transition duration-200 absolute right-2 top-1/2 -translate-y-1/2"
                    title={showPassword ? "Hide password" : "Show password"}
                    onClick={togglePasswordVisibility}
                    aria-label="Hide password"
                  />
                ) : (
                  <IoMdEye
                    className="text-sm md:text-base lg:text-lg cursor-pointer hover:text-gray-700 transition duration-200 absolute right-2 top-1/2 -translate-y-1/2"
                    title={showPassword ? "Hide password" : "Show password"}
                    onClick={togglePasswordVisibility}
                    aria-label="Show password"
                  />
                )}
              </div>
            </div>
            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-gray-700 font-light text-xs md:text-sm lg:text-base"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="text-xs border border-gray-300 bg-neutral-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-tertiary md:text-sm lg:text-base"
              />
              {confirmPasswordError && (
                <p className="text-red-600 font-semibold text-xs md:text-sm lg:text-base cursor-default">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            {serverError && (
              <p className="text-red-600 font-semibold text-xs md:text-sm lg:text-base cursor-default">
                {serverError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="text-xs text-black font-semibold bg-tertiary py-1 rounded-md cursor-pointer shadow-md mt-4 hover:bg-secondary transition-all duration-200 md:py-2 md:text-sm lg:text-base"
          >
            Create an account
          </button>
          <p className="text-xs text-left mt-6 cursor-default md:text-sm lg:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline underline-offset-2 transition-all duration-200 md:text-sm lg:text-base text-blue-800 hover:text-blue-600"
            >
              Login
            </Link>
          </p>
        </form>
      </div>{" "}
    </AuthLayout>
  );
};

export default Register;

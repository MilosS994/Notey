import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import API_PATHS from "../utils/apiPaths.js";
import { showSuccess, showError, showWelcome } from "../utils/toast.js";

import { Eye, EyeOff } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader.jsx";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    global: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    let newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      global: "",
    };

    if (!username || username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      formIsValid = false;
    }

    if (username.length > 55) {
      newErrors.username = "Username can't be more than 55 characters long";
      formIsValid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      formIsValid = false;
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      formIsValid = false;
    }

    if (!confirmPassword && password.length >= 8) {
      newErrors.confirmPassword = "Please confirm your password";
      formIsValid = false;
    } else if (password !== confirmPassword && password.length >= 8) {
      newErrors.confirmPassword = "Passwords do not match";
      formIsValid = false;
    }

    setErrors(newErrors);
    if (!formIsValid) return;

    try {
      setLoading(true);
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        username,
        email,
        password,
      });

      login(res.data.user);
      navigate("/notes");
      showSuccess("Registration successfull!");
      showWelcome(res.data.user.username);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          global: error.response.data.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          global: "Registration failed. Please try again later.",
        }));
      }
      showError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="w-full rounded-lg bg-neutral-100 px-4 py-2 mb-1 text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            autoFocus
          />
          <ErrorMessage message={errors.username} />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-neutral-100 px-4 py-2 mb-1 text-base shadow-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200"
          />
          <ErrorMessage message={errors.email} />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg bg-neutral-100 px-4 py-2 mb-1 text-base shadow-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200"
            />
            <ErrorMessage message={errors.password} />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-2 p-1 ml-2 text-gray-400 hover:text-gray-600 transition-all duration-100 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              autoComplete="new-password"
              className="w-full rounded-lg bg-neutral-100 px-4 py-2 mb-1 text-base shadow-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200"
            />
            <ErrorMessage message={errors.confirmPassword} />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 transition-all duration-100 cursor-pointer"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <ErrorMessage message={errors.global} />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-3 bg-gradient-to-r from-green-400 via-blue-400 to-violet-400 text-white font-bold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {loading ? <Loader size="sm" /> : "Register"}
        </button>

        <div className="text-sm text-center text-gray-600 mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-500 font-semibold hover:underline hover:text-blue-500 transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;

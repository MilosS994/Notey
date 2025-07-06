import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import API_PATHS from "../utils/apiPaths.js";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showInfo } from "../utils/toast.js";

import { Eye, EyeOff } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader.jsx";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    global: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    let newErrors = {
      email: "",
      password: "",
      global: "",
    };

    if (!email) {
      newErrors.email = "Email is required";
      formIsValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      formIsValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      formIsValid = false;
    }

    setErrors(newErrors);
    if (!formIsValid) return;

    try {
      setLoading(true);
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      login(res.data.user);
      navigate("/notes");
      showSuccess("Login successfull!");
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          global: error.response.data.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          global: "Login failed. Please try again later.",
        }));
      }
      showError("Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            autoComplete="email"
            className="w-full rounded-lg bg-neutral-100 px-4 py-2 text-base shadow-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200"
            autoFocus
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoComplete="current-password"
              className="w-full rounded-lg bg-neutral-100 px-4 py-2 text-base shadow-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200"
            />
            <ErrorMessage message={errors.password} />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 transition-all duration-100 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <ErrorMessage message={errors.global} />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-3 bg-gradient-to-r from-green-400 via-blue-400 to-violet-400 text-white font-bold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {loading ? <Loader size="sm" /> : "Login"}
        </button>

        <div className="text-sm text-center text-gray-600 mt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-violet-500 font-semibold hover:underline hover:text-blue-500 transition-all duration-200"
          >
            Register
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;

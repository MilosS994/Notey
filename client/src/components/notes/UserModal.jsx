import { useState, useEffect } from "react";
import { X, LogOut } from "lucide-react";

import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  editUserLoading,
  user,
  handleLogout,
}) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nothingChanged =
      username === user.username && email === user.email && !password;

    if (nothingChanged) {
      setError("You have not made any changes");
      return;
    }

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (username.length > 55) {
      setError("Username can't be more than 55 characters long");
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password && password.length < 8) {
      setError("New password needs to be more than 8 characters long");
      return;
    }

    const data = { username, email, password };

    try {
      const success = await onSubmit(data);
      if (success) {
        onClose();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPassword("");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed min-h-screen p-4 inset-0 z-50 flex items-center justify-center bg-black/40 cursor-default">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg md:text-xl cursor-pointer"
          onClick={onClose}
          disabled={editUserLoading}
        >
          <X />
        </button>

        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-violet-700">
          {user.username}
        </h2>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 md:gap-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={editUserLoading}
            />
          </div>

          <div className="flex flex-col gap-1 md:gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={editUserLoading}
            />
          </div>

          <div className="flex flex-col gap-1 md:gap-2">
            <label htmlFor="currentPassword">New Password</label>
            <input
              type="password"
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={editUserLoading}
            />
          </div>

          <button
            type="submit"
            className="mt-3 rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-green-400 text-white font-bold py-2 shadow hover:scale-105 transition active:scale-95 disabled:opacity-70 cursor-pointer"
            disabled={editUserLoading}
          >
            {editUserLoading ? <Loader size="sm" /> : "Save Changes"}
          </button>

          <ErrorMessage message={error} />
        </form>

        {/* Logout button */}
        <button
          className="mt-3 w-full rounded-full bg-red-400 text-white font-bold py-2 shadow hover:scale-105 transition active:scale-95 disabled:opacity-70 cursor-pointer"
          onClick={() => handleLogout()}
        >
          Logout <LogOut className="inline-block ml-1 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UserModal;

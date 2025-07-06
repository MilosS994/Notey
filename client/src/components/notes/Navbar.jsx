import { Plus, User } from "lucide-react";
import { useState } from "react";

import axiosInstance from "../../utils/axiosInstance.js";
import API_PATHS from "../../utils/apiPaths.js";
import { showError, showSuccess } from "../../utils/toast.js";
import { useAuth } from "../../context/AuthContext.jsx";
import UserModal from "./UserModal";

const SORT_OPTIONS = [
  { value: "multi", label: "Pinned & Priority" },
  { value: "priority_desc", label: "Priority (high → low)" },
  { value: "priority_asc", label: "Priority (low → high)" },
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "title_desc", label: "Title (Z-A)" },
  { value: "pinned", label: "Pinned on top" },
];

const Navbar = ({ value, onChange, search, onSearch, onAddNote }) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);

  const { user, logout } = useAuth();

  const updateUser = async (data) => {
    try {
      setEditUserLoading(true);
      await axiosInstance.patch(API_PATHS.USER.UPDATE_USER, data);
      showSuccess("User updated successfully");
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update user";
      setEditUserError(errorMsg);
      return false;
    } finally {
      setEditUserLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      logout();
      showSuccess("Logout successfull");
    } catch (error) {
      if (error.response?.data?.message) {
        const errMsg = error.response.data.message;
        setLogoutError(errMsg);
        showError(errMsg || "Failed to logout");
      }
    }
  };

  return (
    <nav className="w-full bg-white/80 shadow-sm backdrop-blur sticky top-0 z-40 px-2 md:px-6 py-3 flex items-center justify-between">
      <span className="text-2xl md:text-3xl mr-4 font-bold bg-gradient-to-r from-green-400 via-blue-400 to-violet-400 bg-clip-text text-transparent drop-shadow-2xl select-none hidden sm:block">
        notey
      </span>
      <div className="text-sm flex flex-1 justify-end gap-2 md:gap-4 items-center max-w-2xl">
        <button
          className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-violet-500 via-blue-400 to-green-400 text-white font-semibold rounded-full px-3 sm:px-5 py-2 shadow-sm hover:scale-105 hover:shadow-md transition-all duration-150 focus:outline-none active:scale-95 whitespace-nowrap cursor-pointer"
          onClick={onAddNote}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Note</span>
        </button>
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={onSearch}
          className="rounded-full w-full px-4 py-2 bg-neutral-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-200 shadow transition-all duration-100"
        />
        <select
          value={value}
          onChange={onChange}
          className="rounded-full px-2 py-2 bg-white border border-gray-200 text-gray-700 font-semibold shadow focus:ring-2 focus:ring-violet-200 transition-all duration-100 cursor-pointer w-40 md:w-42"
        >
          {SORT_OPTIONS.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="ml-2 p-2 flex items-center justify-center rounded-full bg-violet-100 hover:bg-violet-200 border border-violet-200 transition-all duration-100 cursor-pointer"
          title="Profile"
          onClick={() => setShowUserModal(true)}
        >
          <User className="w-6 h-6 text-violet-600" />
        </button>
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false), setEditUserError(null);
          }}
          editUserLoading={editUserLoading}
          onSubmit={updateUser}
          user={user}
          handleLogout={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Navbar;

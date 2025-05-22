import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";
import SearchBar from "./SearchBar";

const Navbar = ({ user, searchNotes, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Handle search input
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      return;
    }
    searchNotes(searchQuery);
  };

  // Clear search
  const cleanSearch = async () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-sm ">
      <Link
        className="hidden font-bold text-shadow-md bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent py-2 cursor-pointer sm:block sm:text-lg md:text-xl lg:text-3xl"
        to="/dashboard"
        onClick={cleanSearch}
      >
        notey.
      </Link>
      {user && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            handleSearch={handleSearch}
            cleanSearch={cleanSearch}
          />

          <ProfileInfo onLogout={handleLogout} user={user} />
        </>
      )}
    </div>
  );
};

export default Navbar;

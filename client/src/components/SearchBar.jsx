import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const SearchBar = ({ value, onChange, handleSearch, cleanSearch }) => {
  return (
    <div className="w-3/5 bg-slate-100 rounded-md px-2 py-1 text-black md:w-1/3 md:px-4 md:py-2 lg:w-1/3 relative">
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full text-xs bg-transparent px-2 border-b-2 border-tertiary focus:outline-none focus:border-primary md:text-sm lg:text-lg"
        value={value}
        onChange={onChange}
      />

      {/* Close icon, only if there is a value in the field */}
      {value && (
        <IoClose
          className="text-gray-700 cursor-pointer absolute right-12 top-1/2 transform -translate-y-1/2 text-sm md:text-base lg:text-lg hover:text-black transition duration-200"
          title="Clear search"
          onClick={cleanSearch}
        />
      )}

      {/* Search icon */}
      <FiSearch
        className="text-gray-700 cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-sm md:text-base lg:text-lg hover:text-black transition duration-200"
        title="Search"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;

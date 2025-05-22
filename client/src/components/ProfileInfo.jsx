import { getInitials } from "../utils/helper.js";
import { MdLogout } from "react-icons/md";

const ProfileInfo = ({ onLogout, user }) => {
  return (
    <div className="flex items-center gap-4 justify-center">
      <div
        className="w-12 h-12 text-xl flex items-center justify-center rounded-full text-black bg-slate-200 font-bold md:text-2xl cursor-pointer"
        title="Profile"
      >
        {getInitials(user?.name)}
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="hidden text-black font-semibold cursor-default md:block md:text-md lg:text-2xl">
          {user?.name}
        </p>
        <button
          onClick={onLogout}
          className="text-xs text-black font-medium border-2 border-slate-600 rounded-md px-2 py-1 hover:bg-slate-600 hover:text-white transition duration-200 cursor-pointer md:text-sm"
        >
          <MdLogout
            className="inline-block mr-0.5 text-inherit"
            title="Logout"
          />{" "}
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;

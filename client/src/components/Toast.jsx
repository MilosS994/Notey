import { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  if (!message) return null;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);
  return (
    <div
      className={`absolute bottom-24 right-6 transiion-all duration-400 ${
        isShown ? "opacity-100" : "opacity-0"
      } cursor-default`}
    >
      <div
        className={`min-w-36 max-w-82 bg-white shadow-2xl rounded-md after:w-[5px] after:h-full ${
          type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
        } after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
      >
        <div className="flex items-center gap-3 py-2 px-4">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-600" />
            ) : (
              <LuCheck className="text-xl text-green-600" />
            )}
          </div>

          <p className="text-xs md:text-sm text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;

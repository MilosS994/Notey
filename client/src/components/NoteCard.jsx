import {
  MdCreate,
  MdDelete,
  MdOutlinePushPin,
  MdPushPin,
} from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPin,
}) => {
  return (
    <div className="border-2 border-tertiary rounded-md p-4 bg-white shadow-md hover:shadow-lg transition duration-200 ease-in-out hover:scale-[1.002] cursor-default">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm md:text-base lg:text-xl font-semibold">
            {title}
          </h6>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        {isPinned && (
          <MdPushPin
            className="text-secondary text-lg md:text-xl lg:text-2xl text-shadow-md hover:text-primary cursor-pointer"
            onClick={onPin}
          />
        )}
        {!isPinned && (
          <MdOutlinePushPin
            className="text-primary text-lg md:text-xl lg:text-2xl hover:text-secondary cursor-pointer"
            onClick={onPin}
          />
        )}
      </div>

      <p className="text-xs text-black font-light md:text-sm lg:text-base mt-2">
        {content?.slice(0, 60)}
      </p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500">{tags}</div>
        <div className="flex items-center gap-2">
          <MdCreate
            onClick={onEdit}
            className="text-lg md:text-xl lg:text-2xl text-gray-400 hover:text-green-600 cursor-pointer transition duration-200"
          />
          <MdDelete
            onClick={onDelete}
            className="text-lg md:text-xl lg:text-2xl text-gray-400 hover:text-red-600 cursor-pointer transition duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

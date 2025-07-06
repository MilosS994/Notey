import { useState } from "react";
import { SquarePen, XSquare, Pin, PinOff } from "lucide-react";

import { format } from "date-fns";

import PrioritySelect from "./PrioritySelect";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

const PRIORITY_STYLES = {
  high: "border-l-4 border-red-400",
  medium: "border-l-4 border-yellow-400",
  low: "border-l-4 border-green-400",
};

const NoteCard = ({
  _id,
  title,
  description,
  tags,
  createdAt,
  priority = "low",
  isPinned,
  onPriorityChange,
  onPinChange,
  onDeleteNote,
  onEditNote,
  editError,
  setEditError,
  editNoteLoading,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const formatedDate = format(new Date(createdAt), "dd/MM/yyyy. HH:mm");

  return (
    <div
      className={`rounded-xl shadow-sm p-4 flex flex-col gap-2 relative hover:shadow-md ${
        PRIORITY_STYLES[priority]
      } ${isPinned ? "bg-violet-100" : "bg-white"}`}
    >
      <button
        className={`absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-violet-600 transition-all duration-100 ${
          isPinned && "text-violet-600"
        }`}
        onClick={() => onPinChange()}
      >
        {isPinned ? <Pin /> : <PinOff />}
      </button>
      <h3 className="text-lg md:text-xl font-bold">{title}</h3>
      <p
        className={`text-xs md:text-sm text-gray-700 ${
          showFullDescription ? "" : "line-clamp-2"
        } cursor-pointer`}
        onClick={() => setShowFullDescription((v) => !v)}
      >
        {description}
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {tags &&
          tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-200 text-violet-700 text-xs rounded-full px-2 py-1"
            >
              {tag}
            </span>
          ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400 font-light">{formatedDate}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <PrioritySelect
          value={priority}
          onChange={(e) => onPriorityChange?.(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="text-blue-400 hover:text-blue-600 text-xs cursor-pointer transition-all duration-100"
            onClick={() => setEditModalOpen(true)}
          >
            <SquarePen />
          </button>
          <button
            className="text-red-400 hover:text-red-600 text-xs cursor-pointer transition-all duration-100"
            onClick={() => setDeleteModalOpen(true)}
          >
            <XSquare />
          </button>
        </div>
      </div>
      {/* Delete note modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={() => {
          onDeleteNote();
          setDeleteModalOpen(false);
        }}
        onClose={() => setDeleteModalOpen(false)}
      >
        <p>Delete this note?</p>
      </DeleteModal>
      {/* Edit note modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false), setEditError(null);
        }}
        note={{
          _id,
          title,
          description,
          tags,
          priority,
        }}
        onSubmit={async (data) => {
          await onEditNote(_id, data);
        }}
        editNoteLoading={editNoteLoading}
        editError={editError}
        setEditError={setEditError}
      />
    </div>
  );
};

export default NoteCard;

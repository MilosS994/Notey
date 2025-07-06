import { useState } from "react";
import { X } from "lucide-react";

import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const CreateNoteModal = ({
  isOpen,
  onClose,
  onCreate,
  loading = false,
  createError,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("low");
  const [isPinned, setIsPinned] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed p-4 inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-default">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative animate-fade-in">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg md:text-xl cursor-pointer"
          onClick={onClose}
          disabled={loading}
        >
          <X />
        </button>

        {/* Create new note */}
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-violet-700">
          Create New Note
        </h2>

        {/* Form */}
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate({
              title,
              description,
              tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              priority,
              isPinned,
            });
          }}
        >
          <input
            className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            disabled={loading}
          />
          <textarea
            className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition resize-none min-h-[64px]"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={6}
            disabled={loading}
          />
          <input
            className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
          />

          <div className="flex items-center gap-2">
            <select
              className="rounded-full px-3 py-2 text-sm md:text-base bg-white border border-gray-200 text-gray-700 font-semibold shadow focus:ring-2 focus:ring-violet-200 transition-all duration-100 cursor-pointer"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1 text-sm text-gray-500 ml-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                disabled={loading}
              />
              Pin to top
            </label>
          </div>

          <button
            type="submit"
            className="mt-3 rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-green-400 text-white font-bold py-2 shadow hover:scale-105 transition active:scale-95 disabled:opacity-70 cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader size="sm" /> : "Create Note"}
          </button>
          <ErrorMessage message={createError} />
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;

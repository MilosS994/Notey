import { useState, useEffect } from "react";
import { X } from "lucide-react";

import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const EditModal = ({
  isOpen,
  onClose,
  note,
  onSubmit,
  editNoteLoading,
  editError,
  setEditError,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    priority: "low",
    isPinned: false,
  });

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title || "",
        description: note.description || "",
        tags: (note.tags || []).join(", "),
        priority: note.priority || "low",
        isPinned: note.isPinned || false,
      });
    }
  }, [note, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there is no title entered
    if (!form.title.trim()) {
      setEditError("Title is required");
      return;
    }

    // Check if there are changes made at all
    const tagsArr = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const isChanged =
      form.title !== (note.title || "") ||
      form.description !== (note.description || "") ||
      JSON.stringify(tagsArr) !== JSON.stringify(note.tags || []) ||
      form.priority !== (note.priority || "low") ||
      form.isPinned !== (note.isPinned || false);

    if (!isChanged) {
      setEditError("You have not made any changes");
      return;
    }

    onSubmit({
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed p-4 inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-default">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative animate-fade-in">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg md:text-xl cursor-pointer"
          onClick={onClose}
          disabled={editNoteLoading}
        >
          <X />
        </button>

        {/* Edit note heading */}
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-violet-700">
          Edit Note
        </h2>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            name="title"
            className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
            disabled={editNoteLoading}
          />
          <textarea
            name="description"
            className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition resize-none min-h-[64px]"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            maxLength={1000}
            rows={6}
            disabled={editNoteLoading}
          />
          <input
            name="tags"
            className="rounded-lg bg-neutral-100 px-4 py-2 text-sm md:text-base shadow-sm border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            disabled={editNoteLoading}
          />

          <div className="flex items-center gap-2">
            <select
              name="priority"
              className="rounded-full px-3 py-2 text-sm md:text-base bg-white border border-gray-200 text-gray-700 font-semibold shadow focus:ring-2 focus:ring-violet-200 transition-all duration-100 cursor-pointer"
              value={form.priority}
              onChange={handleChange}
              disabled={editNoteLoading}
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
                name="isPinned"
                checked={form.isPinned}
                onChange={handleChange}
                disabled={editNoteLoading}
              />
              Pin to top
            </label>
          </div>

          <button
            type="submit"
            className="mt-3 rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-green-400 text-white font-bold py-2 shadow hover:scale-105 transition active:scale-95 disabled:opacity-70 cursor-pointer"
            disabled={editNoteLoading}
          >
            {editNoteLoading ? <Loader size="sm" /> : "Save Changes"}
          </button>
          <ErrorMessage message={editError} />
        </form>
      </div>
    </div>
  );
};

export default EditModal;

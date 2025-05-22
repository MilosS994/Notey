import { useState } from "react";
import TagInput from "../../components/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance.js";
import API_PATHS from "../../utils/apiPaths.js";

const AddEditNotes = ({ noteData, type, onClose, getNotes, showToast }) => {
  const [title, setTitle] = useState(noteData ? noteData.title : "");
  const [content, setContent] = useState(noteData ? noteData.content : "");
  const [tags, setTags] = useState(noteData ? noteData.tags : []);

  const [error, setError] = useState(null);

  //   Add a new note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.NOTES.CREATE_NOTE, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToast({ type: "add", message: "Note added successfully" });
        getNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("Error adding note: ", error.response.data.message);
        setError(error.response.data.message);
      }
    }
  };

  //   Edit an existing note
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.patch(
        API_PATHS.NOTES.UPDATE_NOTE(noteId),
        {
          title,
          content,
          tags,
        }
      );
      if (response.data && response.data.note) {
        showToast({ type: "add", message: "Note updated successfully" });
        getNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("Error updating note: ", error.response.data.message);
        setError(error.response.data.message);
      }
    }
  };

  //   Handle the add/edit note action, check if the title and content are not empty
  const handleAddNote = () => {
    if (title.trim() === "") {
      setError("Title is required");
      return;
    }
    if (content.trim() === "") {
      setError("Content is required");
      return;
    }
    setError(null);

    if (type === "edit") {
      // Check if the note is not empty and if the title and content are not the same as the existing note
      if (
        title === noteData.title &&
        content === noteData.content &&
        JSON.stringify(tags) === JSON.stringify(noteData.tags)
      ) {
        setError("No changes were made");
        return;
      }
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative cursor-default h-full w-full bg-white rounded-md flex flex-col lg:gap-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="w-10 h-10 absolute -top-4 -right-6"
        title="Close"
      >
        <MdClose className="text-xl md:text-2xl text-gray-600 font-bold hover:text-gray-400 transition-all duration-200 cursor-pointer" />
      </button>
      <div className="flex flex-col gap-2">
        {/* Title */}
        <label
          htmlFor=""
          className="text-xs md:text-sm lg:text-base text-gray-500 font-semibold"
        >
          Title
        </label>
        <input
          type="text"
          className="text-lg md:text-xl text-black outline-none bg-blue-50 shadow-sm p-2 rounded-md"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>
      {/* Content */}
      <div className="flex flex-col gap-2 mt-4">
        <label
          htmlFor=""
          className="text-xs md:text-sm lg:text-base text-gray-500 font-semibold"
        >
          Content
        </label>
        <textarea
          typeof="text"
          className="text-sm md:text-base text-black outline-none bg-blue-50 shadow-sm p-2 rounded-md"
          placeholder="Content"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      {/* Tags */}
      <div className="mt-3 flex flex-col gap-2 justify-center">
        <label
          htmlFor=""
          className="text-xs md:text-sm lg:text-base text-gray-500 font-semibold"
        >
          Tags
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs md:text-sm text-red-500 pt-4 font-semibold lg:pt-0">
          {error}
        </p>
      )}

      <button
        className="w-full bg-primary text-white text-sm font-semibold py-2 px-4 rounded-md mt-4 shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-secondary active:scale-95"
        onClick={handleAddNote}
      >
        {type === "edit" ? "Save Note" : "Add Note"}
      </button>
    </div>
  );
};

export default AddEditNotes;

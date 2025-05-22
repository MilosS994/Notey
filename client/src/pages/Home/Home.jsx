import { MdAdd } from "react-icons/md";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/NoteCard";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import API_PATHS from "../../utils/apiPaths.js";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Toast from "../../components/Toast.jsx";
import PaperImage from "../../assets/paper-img.png";
import Envelope from "../../assets/envelope.png";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMessage, setShowToastMessage] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [user, setUser] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  // Handle edit note
  const handleEditNote = (note) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: note });
  };

  // Handle delete note
  const handleDeleteNote = async (noteId) => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.NOTES.DELETE_NOTE(noteId)
      );
      if (response.data && response.data.message) {
        getNotes();
        showToast({ type: "delete", message: "Note deleted successfully" });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error deleting note: ", error.response.data.message);
      }
    }
  };

  // Search notes
  const searchNotes = async (query) => {
    try {
      const response = await axiosInstance.get(API_PATHS.NOTES.SEARCH_NOTES, {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error searching notes: ", error);
    }
  };

  // Toggle pin
  const togglePinNote = async (note) => {
    const noteId = note._id;
    try {
      const response = await axiosInstance.patch(
        API_PATHS.NOTES.PIN_NOTE(noteId)
      );
      if (response.data && response.data.note) {
        showToast({
          type: "add",
          message: !note.isPinned
            ? "Note pinned successfully"
            : "Note unpinned successfully",
        });
        getNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error(
          "Error pinning/unpinning note: ",
          error.response.data.message
        );
        setError(error.response.data.message);
      }
    }
  };

  // Handle clear search
  const handleClearSearch = async () => {
    setIsSearch(false);
    getNotes();
  };

  // Show toast message
  const showToast = ({ type, message }) => {
    setShowToastMessage({
      isShown: true,
      message,
      type,
    });
  };

  // Handle close toast
  const handleCloseToast = () => {
    setShowToastMessage({
      isShown: false,
      message: "",
    });
  };

  // Get user data
  const getUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        console.error("Unauthorized access. Redirecting to login.");
        navigate("/login");
      }
    }
  };

  // Get all notes
  const getNotes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.NOTES.GET_ALL_NOTES);
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  useEffect(() => {
    getUser();
    getNotes();
  }, []);

  return (
    <>
      <Navbar
        user={user}
        searchNotes={searchNotes}
        handleClearSearch={handleClearSearch}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2 md:py-4">
            {allNotes.map((note, index) => (
              <NoteCard
                key={index}
                title={note.title}
                date={`${new Date(
                  note.createdAt
                ).toLocaleDateString()} ${new Date(
                  note.createdAt
                ).toLocaleTimeString()}`}
                content={note.content}
                tags={note.tags.map((tag) => `#${tag}`).join(", ")}
                isPinned={note.isPinned}
                onEdit={() => {
                  handleEditNote(note);
                }}
                onDelete={() => {
                  handleDeleteNote(note._id);
                }}
                onPin={() => {
                  togglePinNote(note);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2 mt-24 md:gap-4">
            <img
              src={isSearch ? Envelope : PaperImage}
              alt="Notes"
              className="w-46 md:w-56 lg:w-66"
            />
            <p className="text-center text-sm md:text-base lg:text-lg text-black text-shadow-md cursor-default">
              {isSearch
                ? "Oops, there are no matching results!"
                : "Click `Add` button in the bottom right corner to share your ideas."}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
        className={`w-12 h-12 bg-primary rounded-full fixed bottom-4 right-4 flex items-center justify-center shadow-lg hover:shadow-xl transition duration-200 md:w-14 md:h-14 lg:w-16 lg:h-16 cursor-pointer z-50 hover:translate-y-0.5 hover:translate-x-0.5 hover:bg-secondary active:scale-95 ${
          openAddEditModal.isShown ? "hidden" : "block"
        }`}
        title="Add Note"
      >
        <span className="sr-only">Add Note</span>
        <MdAdd className="text-white font-semibold text-shadow-md text-lg md:text-2xl lg:text-4xl" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        ariaHideApp={false}
        className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] h-auto max-h-[80vh] mx-auto mt-20 p-4 rounded-md bg-white shadow-lg overflow-auto overflow-x-hidden"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getNotes={getNotes}
          showToast={showToast}
        />
      </Modal>

      <Toast
        isShown={showToastMessage.isShown}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;

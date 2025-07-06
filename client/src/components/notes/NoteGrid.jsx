import { useState, useEffect, useCallback } from "react";

import axiosInstance from "../../utils/axiosInstance.js";
import API_PATHS from "../../utils/apiPaths.js";

import Loader from "..//../components/Loader.jsx";
import NoteCard from "./NoteCard";
import CreateNoteModal from "./CreateNoteModal.jsx";

import { showSuccess, showError } from "../../utils/toast.js";

const SORT_API_MAP = {
  multi: () => axiosInstance.get(API_PATHS.NOTES.SORT_MULTI),
  priority_desc: () =>
    axiosInstance.get(API_PATHS.NOTES.SORT_BY_PRIORITY + "?order=desc"),
  priority_asc: () =>
    axiosInstance.get(API_PATHS.NOTES.SORT_BY_PRIORITY + "?order=asc"),
  date_desc: () =>
    axiosInstance.get(API_PATHS.NOTES.SORT_BY_DATE + "?order=desc"),
  date_asc: () =>
    axiosInstance.get(API_PATHS.NOTES.SORT_BY_DATE + "?order=asc"),
  title_asc: () =>
    axiosInstance.get(API_PATHS.NOTES.SORT_BY_TITLE + "?order=asc"),
  title_desc: () =>
    axiosInstance.get(API_PATHS.NOTES.SORT_BY_TITLE + "?order=desc"),
  pinned: () =>
    axiosInstance.get(API_PATHS.NOTES.SORT_BY_PINNED + "?order=desc"),
};

const NoteGrid = ({
  sortValue,
  search,
  showCreateNoteModal,
  setShowCreateNoteModal,
}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [createNoteLoading, setCreateNoteLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [editNoteLoading, setEditNoteLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (search && search.trim() !== "") {
        res = await axiosInstance.get(
          `${API_PATHS.NOTES.SEARCH_NOTES}?q=${encodeURIComponent(search)}`
        );
      } else {
        res = await SORT_API_MAP[sortValue]();
      }
      setNotes(res.data.notes);
      setError(null);
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message || "Failed to fetch notes");
      }
    } finally {
      setLoading(false);
    }
  }, [sortValue, search]);

  const handlePriorityChange = async (noteId, newPriority) => {
    try {
      await axiosInstance.patch(API_PATHS.NOTES.UPDATE_NOTE(noteId), {
        priority: newPriority,
      });
      showSuccess("Priority changed successfully");
      fetchNotes();
    } catch (error) {
      showError("Failed to change priority");
    }
  };

  const handlePinChange = async (noteId) => {
    try {
      const res = await axiosInstance.patch(API_PATHS.NOTES.PIN_NOTE(noteId));
      const isNowPinned = res.data?.note?.isPinned === true;
      showSuccess(
        isNowPinned ? "Note pinned to the top" : "Note unpinned from the top"
      );
      fetchNotes();
    } catch (error) {
      showError("Failed to pin note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axiosInstance.delete(API_PATHS.NOTES.DELETE_NOTE(noteId));
      fetchNotes();
      showSuccess("Note deleted successfully");
      setDeleteError(null);
    } catch (error) {
      if (error.response?.data?.message) {
        setDeleteError(error.response.data.message);
      }
      showError(deleteError || "Failed to delete note");
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      setCreateNoteLoading(true);
      await axiosInstance.post(API_PATHS.NOTES.CREATE_NOTE, noteData);
      setShowCreateNoteModal(false);
      fetchNotes();
      showSuccess("Note created successfully");
      setCreateError(null);
    } catch (error) {
      if (error.response?.data?.message) {
        setCreateError(error.response.data.message);
      }
    } finally {
      setCreateNoteLoading(false);
    }
  };

  const handleEditNote = async (noteId, data) => {
    try {
      setEditNoteLoading(true);
      await axiosInstance.patch(API_PATHS.NOTES.UPDATE_NOTE(noteId), data);
      showSuccess("Note updated successfully");
      fetchNotes();
      return true;
    } catch (error) {
      if (error.response?.data?.message) {
        setEditError(error.response.data.message);
      }
    } finally {
      setEditNoteLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-slate-100">
      <div className="cursor-default p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {error && <div className="text-red-500">{error}</div>}
        {!loading && notes.length === 0 && !error && (
          <div className="text-center text-md md:text-lg lg:text-xl font-semibold col-span-full text-gray-400 py-12">
            No notes yet.
          </div>
        )}
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            refetchNotes={fetchNotes}
            {...note}
            onPriorityChange={(newPriority) =>
              handlePriorityChange(note._id, newPriority)
            }
            onPinChange={() => handlePinChange(note._id)}
            onDeleteNote={() => handleDeleteNote(note._id)}
            onEditNote={handleEditNote}
            editError={editError}
            setEditError={setEditError}
            editNoteLoading={editNoteLoading}
          />
        ))}
      </div>
      {/* Create Note modal */}
      <CreateNoteModal
        isOpen={showCreateNoteModal}
        onClose={() => {
          setShowCreateNoteModal(false), setCreateError(null);
        }}
        onCreate={handleCreateNote}
        loading={createNoteLoading}
        createError={createError}
      />
    </div>
  );
};

export default NoteGrid;

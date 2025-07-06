import express from "express";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  setPinNote,
  updateNote,
} from "../controllers/note.controller.js";
import { searchNotes } from "../controllers/searchNotes.controller.js";
import {
  sortNotesByPriority,
  sortNotesByDate,
  sortNotesByPinned,
  sortNotesByTitle,
  sortNotesMultiField,
} from "../controllers/sortNotes.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(verifyToken);

// CREATE NOTE
router.post("/", createNote);

// GET NOTES
router.get("/", getNotes);

// SEARCH NOTES
router.get("/search", searchNotes);

// GET NOTE
router.get("/:noteId", getNote);

// UPDATE NOTE
router.patch("/:noteId", updateNote);

// DELETE NOTE
router.delete("/:noteId", deleteNote);

// PIN/UNPIN NOTE
router.patch("/:noteId/pin", setPinNote);

// SORT NOTES
router.get("/sort/priority", sortNotesByPriority); // by priority
router.get("/sort/date", sortNotesByDate); // by date of creation
router.get("/sort/title", sortNotesByTitle); // by title
router.get("/sort/pinned", sortNotesByPinned); // by pin
router.get("/sort/multi", sortNotesMultiField); // multifield

export default router;

import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  pinNote,
  searchNotes,
} from "../controllers/note.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

//  Create a new note
router.post("/", protect, createNote);
//  Get all notes for a user
router.get("/", protect, getNotes);
// Search notes
router.get("/search", protect, searchNotes);
//  Get a single note by ID
router.get("/:id", protect, getNote);
//  Update a note by ID
router.patch("/:id", protect, updateNote);
//  Delete a note by ID
router.delete("/:id", protect, deleteNote);
//  Pin/Unpin a note by ID
router.patch("/pin/:id", protect, pinNote);

export default router;

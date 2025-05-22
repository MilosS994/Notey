import Note from "../models/note.model.js";

// Create a new note
export const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    const userId = req.user._id;

    // Validate the request body
    if (!title) {
      const error = new Error("Title is required");
      error.statusCode = 400;
      throw error;
    }
    if (!content) {
      const error = new Error("Content is required");
      error.statusCode = 400;
      throw error;
    }

    // Create a new note
    const note = await Note.create({
      title,
      content,
      tags: tags ? tags : [],
      isPinned,
      user: userId,
    });

    note.__v = undefined;

    // Send response
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Get all notes for a user
export const getNotes = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all notes for the user and sort them by isPinned and createdAt
    const notes = await Note.find({ user: userId }).sort({
      isPinned: -1,
      createdAt: -1,
    });

    notes.forEach((note) => {
      note.__v = undefined;
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single note by ID
export const getNote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    // Fetch the note by ID
    const note = await Note.findOne({ _id: id, user: userId });

    // Check if the note exists
    if (!note) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    note.__v = undefined;

    // Send response
    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Update a note
export const updateNote = async (req, res, next) => {
  const id = req.params.id;
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user._id;

  try {
    // Validate the request body
    if (!title && !content && !tags && isPinned === undefined) {
      const error = new Error("No changes provided");
      error.statusCode = 400;
      throw error;
    }

    // Update the note
    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: req.body },
      { new: true }
    );

    // Check if the note exists
    if (!note) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    note.__v = undefined;

    // Send response
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a note
export const deleteNote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    // Delete the note
    const note = await Note.findOneAndDelete({ _id: id, user: userId });

    // Check if the note exists
    if (!note) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    // Send response
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Pin or unpin a note
export const pinNote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    // Fetch the note by ID
    const note = await Note.findOne({ _id: id, user: userId });

    // Check if the note exists
    if (!note) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    // Toggle the isPinned status
    note.isPinned = !note.isPinned;
    await note.save();

    note.__v = undefined;

    // Send response
    res.status(200).json({
      success: true,
      message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Search notes
export const searchNotes = async (req, res, next) => {
  const user = req.user;
  const { query } = req.query;

  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const matchingNotes = await Note.find({
      user: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      success: true,
      notes: matchingNotes,
      message: "Matching notes successfully fetched",
    });
  } catch (error) {
    next(error);
  }
};

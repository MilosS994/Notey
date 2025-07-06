import Note from "../models/note.model.js";

// CREATE NOTE
export const createNote = async (req, res, next) => {
  const user = req.user;
  const { title, description, tags, priority, isPinned } = req.body;

  // Validate title
  if (
    !title ||
    typeof title !== "string" ||
    title.trim().length < 2 ||
    title.trim().length > 75
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Title is required, must be at least 2 characters and less than 75 characters",
    });
  }

  try {
    const note = await Note.create({
      title,
      description,
      tags,
      priority,
      isPinned,
      author: user._id,
    });

    res
      .status(201)
      .json({ success: true, message: "Note created successfully", note });
  } catch (error) {
    next(error);
  }
};

// GET ALL NOTES
export const getNotes = async (req, res, next) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const notes = await Note.find({ author: user._id })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Note.countDocuments({ author: user._id });

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    next(error);
  }
};

// GET NOTE
export const getNote = async (req, res, next) => {
  const user = req.user;
  const { noteId } = req.params;

  try {
    const note = await Note.findOne({ _id: noteId, author: user._id });

    if (!note) {
      const error = new Error("Note not found");
      error.status = 404;
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "Note fetched successfully", note });
  } catch (error) {
    next(error);
  }
};

// UPDATE NOTE
export const updateNote = async (req, res, next) => {
  const user = req.user;
  const { noteId } = req.params;
  const { title, description, tags, priority, isPinned } = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, author: user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!note) {
      const error = new Error("Note not found");
      error.status = 404;
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "Note updated successfully", note });
  } catch (error) {
    next(error);
  }
};

// DELETE NOTE
export const deleteNote = async (req, res, next) => {
  const user = req.user;
  const { noteId } = req.params;

  try {
    const note = await Note.findOneAndDelete({ _id: noteId, author: user._id });

    if (!note) {
      const error = new Error("Note not found");
      error.status = 404;
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// PIN/UNPIN NOTE
export const setPinNote = async (req, res, next) => {
  const { noteId } = req.params;
  const user = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, author: user._id });

    if (!note) {
      const error = new Error("Note not found");
      error.status = 404;
      throw error;
    }

    note.isPinned = !note.isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Pin status successfully changed",
      note,
    });
  } catch (error) {
    next(error);
  }
};

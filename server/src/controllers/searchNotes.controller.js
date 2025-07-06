import Note from "../models/note.model.js";

// SEARCH NOTES
export const searchNotes = async (req, res, next) => {
  try {
    const { priority, tags, isPinned, q } = req.query;

    const filter = { author: req.user._id }; // Filter for user to get only his/her notes

    if (priority) filter.priority = priority;
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
      filter.tags = { $in: tagsArray };
    }
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const notes = await Note.find(filter);

    if (notes.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No results", notes });
    }

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

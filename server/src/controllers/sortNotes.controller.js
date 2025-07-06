import Note from "../models/note.model.js";

// SORT NOTES BY PRIORITY
export const sortNotesByPriority = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order === "asc" ? 1 : -1;

    const pipeline = [
      { $match: { author: req.user._id } },

      {
        $addFields: {
          priorityValue: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "high"] }, then: 3 },
                { case: { $eq: ["$priority", "medium"] }, then: 2 },
                { case: { $eq: ["$priority", "low"] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      },

      { $sort: { priorityValue: order } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const notes = await Note.aggregate(pipeline);

    const total = await Note.countDocuments({ author: req.user._id }); // Get total number of user's notes

    res.status(200).json({
      success: true,
      message: "Notes sorted by priority",
      notes,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    next(error);
  }
};

// SORT NOTES BY DATE
export const sortNotesByDate = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order === "asc" ? 1 : -1;

    const notes = await Note.find({ author: req.user._id })
      .sort({
        createdAt: order,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Note.countDocuments({ author: req.user._id }); // Get total number of user's notes

    res.status(200).json({
      success: true,
      message: "Notes sorted by date",
      notes,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    next(error);
  }
};

// SORT NOTES BY TITLE
export const sortNotesByTitle = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order === "asc" ? 1 : -1;

    const notes = await Note.find({ author: req.user._id })
      .sort({
        title: order,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Note.countDocuments({ author: req.user._id }); // Get total number of user's notes

    res.status(200).json({
      success: true,
      message: "Notes sorted by title",
      notes,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    next(error);
  }
};

// SORT NOTES BY PIN
export const sortNotesByPinned = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order === "asc" ? 1 : -1;

    const notes = await Note.find({ author: req.user._id })
      .sort({
        isPinned: order,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Note.countDocuments({ author: req.user._id }); // Get total number of user's notes

    res.status(200).json({
      success: true,
      message: "Notes sorted by pin",
      notes,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    next(error);
  }
};

// SORT NOTES BY MULTIPLE FIELDS
export const sortNotesMultiField = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order === "asc" ? 1 : -1;

    const pipeline = [
      { $match: { author: req.user._id } },

      {
        $addFields: {
          priorityValue: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "high"] }, then: 3 },
                { case: { $eq: ["$priority", "medium"] }, then: 2 },
                { case: { $eq: ["$priority", "low"] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      },

      {
        $sort: {
          isPinned: -1, // Pinned always first
          priorityValue: order,
          createdAt: order,
        },
      },

      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const notes = await Note.aggregate(pipeline);
    const total = await Note.countDocuments({ author: req.user._id });

    res.status(200).json({
      success: true,
      message: "Notes sorted by multiple fields (custom priority)",
      notes,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    next(error);
  }
};

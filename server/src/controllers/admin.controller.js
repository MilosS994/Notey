import User from "../models/user.model.js";

// DELETE ANY USER
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: user._id,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL USERS AND THEIR NOTES
export const getUsersWithNotes = async (req, res, next) => {
  try {
    const users = await User.find().populate("notes").select("-password");

    res
      .status(200)
      .json({ success: true, message: "Users fetched successfully", users });
  } catch (error) {
    next(error);
  }
};

import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

// REGISTER USER
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  //   Check if any field is missing
  if (!email || !password || !username) {
    const error = new Error("All fields are required");
    error.status = 400;
    return next(error);
  }

  //   Check if username is already taken
  const existingUsername = await User.exists({ username });
  if (existingUsername) {
    const error = new Error("Username already taken");
    error.status = 400;
    return next(error);
  }

  //   Check if user already exists
  const existingUser = await User.exists({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 400;
    return next(error);
  }

  try {
    const isFirstUser = (await User.estimatedDocumentCount()) === 0;

    const user = await User.create({
      username,
      email,
      password,
      isAdmin: isFirstUser, // Give admin only to the first user
    });

    const token = generateToken(user); // Generate token for user

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "None",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    const { password: _, ...userWithoutPassword } = user.toObject(); // Remove password from user

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  //   Check if any field is missing
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    return next(error);
  }

  try {
    //   Check if user exists and find him
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const isMatch = await user.comparePassword(password); // Compare password to one in database

    // Throw error if wrong password is entered
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.status = 404;
      throw error;
    }

    const token = generateToken(user); // Generate token for user

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "None",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    const { password: _, ...userWithoutPassword } = user.toObject(); // Remove password from user

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "None",
      path: "/",
    });

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// GET USER INFO
export const getMe = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      const error = new Error("Not authorized");
      error.status = 401;
      throw error;
    }

    const { password: _, ...userWithoutPassword } = req.user.toObject();

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

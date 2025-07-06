import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      const error = new Error("No token provided");
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  const user = req.user;

  if (!user || user.isAdmin !== true) {
    const error = new Error("Access forbidden: Admins only");
    error.status = 403;
    return next(error);
  }

  next();
};

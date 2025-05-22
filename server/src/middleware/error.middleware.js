import { NODE_ENV } from "../config/env.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR caught by middleware:`);
  console.error("Status Code:", err.statusCode || 500);
  console.error("Message:", err.message);

  if (NODE_ENV === "development") {
    console.error("Stack:", err.stack);
  } else {
    console.error("Error Name:", err.name);
    console.error("Error Code:", err.code);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Invalid token
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  // Expired token
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;

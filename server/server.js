import express from "express";
import cors from "cors";

import connectDB from "./src/database/mongodb.js";
import authRoutes from "./src/routes/auth.routes.js";
import noteRoutes from "./src/routes/note.routes.js";

import erorMiddleware from "./src/middleware/error.middleware.js";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);

// Error handling middleware
app.use(erorMiddleware);

// PORT
const PORT = process.env.PORT || 5500;

// START SERVER
const startServer = async () => {
  try {
    await connectDB(); //Connect to MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start a server: ", error.message);
    process.exit(1); // Exit the process with failure
  }
};

startServer(); // Start the server

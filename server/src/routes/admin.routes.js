import express from "express";
import {
  deleteUser,
  getUsersWithNotes,
} from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

// DELETE ANY USER
router.delete("/users/:userId", deleteUser);

// GET ALL USERS WITH THEIR NOTES
router.get("/users", getUsersWithNotes);

export default router;

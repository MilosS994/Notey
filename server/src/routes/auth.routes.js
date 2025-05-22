import express from "express";
import {
  getUserInfo,
  login,
  register,
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getUserInfo);

export default router;

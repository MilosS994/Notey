import express from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

// UPDATE USER INFO
router.patch("/me", updateUser);

// DELETE USER
router.delete("/me", deleteUser);

export default router;

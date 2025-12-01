import express from "express";
import {
	registerUser,
	loginUser,
	getMe,
	getUsers,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/", getUsers);

export default router;

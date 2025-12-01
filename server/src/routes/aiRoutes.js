import express from "express";
import { summarizePost, translatePost } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/summarize", protect, summarizePost);
router.post("/translate", protect, translatePost);

export default router;

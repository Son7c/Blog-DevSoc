import express from "express";
import {
	getPosts,
	getPost,
	getMyPosts,
	setPost,
	updatePost,
	deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPosts).post(protect, setPost);
router.route("/my").get(protect, getMyPosts);
router
	.route("/:id")
	.get(getPost)
	.put(protect, updatePost)
	.delete(protect, deletePost);

export default router;

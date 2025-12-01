import Post from "../models/Post.js";
import User from "../models/User.js";

export const getPosts = async (req, res) => {
	try {
		// console.log('Fetching posts...');
		const posts = await Post.find().populate("user", "name email");
		// console.log(`Found ${posts.length} posts`);
		res.status(200).json(posts);
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500).json({ message: error.message });
	}
};

export const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getMyPosts = async (req, res) => {
	try {
		const posts = await Post.find({ user: req.user.id });
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const setPost = async (req, res) => {
	try {
		const { title, content } = req.body;

		if (!title || !content) {
			return res.status(400).json({ message: "Please add title and content" });
		}

		const post = await Post.create({
			title,
			content,
			user: req.user.id,
		});

		res.status(201).json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ message: "User not authorized" });
		}

		const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ message: "User not authorized" });
		}

		await post.deleteOne();

		res.status(200).json({ id: req.params.id });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./utils/db.js";
import { envKeys } from "./utils/envKeys.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: envKeys.CLIENT_URL,
		credentials: true,
	}),
);

const PORT = envKeys.PORT;

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/ai", aiRoutes);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

// Connect to MongoDB (for serverless, reuse connections)
const connectToDatabase = async () => {
	// Check if already connected
	if (mongoose.connection.readyState === 1) {
		console.log("Using existing MongoDB connection");
		return;
	}

	try {
		console.log("Connecting to MongoDB...");
		await connectDB(envKeys.MONGO_URI);
	} catch (err) {
		console.error("MongoDB connect error: ", err);
		throw err;
	}
};

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("Error:", err);
	res.status(500).json({
		message: err.message || "Internal server error",
		error: process.env.NODE_ENV === "production" ? {} : err,
	});
});

// For Vercel serverless
export default async (req, res) => {
	try {
		await connectToDatabase();
		return app(req, res);
	} catch (error) {
		console.error("Serverless function error:", error);
		return res.status(500).json({
			message: "Database connection failed",
			error: error.message,
		});
	}
};

// For local development
if (process.env.NODE_ENV !== "production") {
	connectDB(envKeys.MONGO_URI)
		.then(() => {
			app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
		})
		.catch((err) => {
			console.error("MongoDB connect error: ", err);
			process.exit(1);
		});
}

import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "GEMINI_API_KEY"];
const missingEnvVars = requiredEnvVars.filter(
	(varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
	console.error(
		"Missing required environment variables:",
		missingEnvVars.join(", "),
	);
	if (process.env.NODE_ENV === "production") {
		throw new Error(
			`Missing required environment variables: ${missingEnvVars.join(", ")}`,
		);
	}
}

export const envKeys = {
	PORT: parseInt(process.env.PORT) || 8000,
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
	NODE_ENV: process.env.NODE_ENV || "development",
	GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

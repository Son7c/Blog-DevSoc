import mongoose from "mongoose";

export const connectDB = async (mongoUri) => {
	try {
		if (!mongoUri) {
			throw new Error("MONGO_URI is not defined");
		}

		// Mongoose connection options for serverless
		const options = {
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		};

		await mongoose.connect(mongoUri, options);
		console.log("MongoDB Connected Successfully");
	} catch (error) {
		console.error(`MongoDB Connection Error: ${error.message}`);
		throw error;
	}
};

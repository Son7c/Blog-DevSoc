import mongoose from "mongoose";

const postSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: [true, "Please add a title"],
		},
		content: {
			type: String,
			required: [true, "Please add content"],
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Post", postSchema);

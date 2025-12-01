import { GoogleGenerativeAI } from "@google/generative-ai";
import { envKeys } from "../utils/envKeys.js";

const getGenAI = () => {
	if (!envKeys.GEMINI_API_KEY) {
		throw new Error("GEMINI_API_KEY is not configured");
	}
	return new GoogleGenerativeAI(envKeys.GEMINI_API_KEY);
};

export const summarizePost = async (req, res) => {
	try {
		const { title, content } = req.body;

		if (!title || !content) {
			return res
				.status(400)
				.json({ message: "Title and content are required" });
		}

		const genAI = getGenAI();
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
		const prompt = `You are an expert editor. Summarize the following blog post in 2-3 engaging sentences that capture the main idea and hook the reader. Do not use "Here is a summary" or similar phrases, just give the summary directly.\n\nTitle: ${title}\n\nContent: ${content}`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const summary = response.text();

		res.status(200).json({ summary });
	} catch (error) {
		console.error("AI Summarize Error:", error);
		res
			.status(500)
			.json({ message: "Failed to generate summary: " + error.message });
	}
};

export const translatePost = async (req, res) => {
	try {
		const { title, content, targetLanguage } = req.body;

		if (!title || !content || !targetLanguage) {
			return res
				.status(400)
				.json({ message: "Title, content, and target language are required" });
		}

		const genAI = getGenAI();
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
		const prompt = `Translate the following blog post to ${targetLanguage}. Return ONLY a valid JSON object with "title" and "content" fields. Do not include any markdown formatting or code blocks.\n\nTitle: ${title}\n\nContent: ${content}`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const translatedText = response.text();

		const jsonMatch = translatedText.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const translated = JSON.parse(jsonMatch[0]);
			res.status(200).json(translated);
		} else {
			res.status(200).json({
				title: title,
				content: translatedText,
			});
		}
	} catch (error) {
		console.error("AI Translate Error:", error);
		res.status(500).json({ message: "Failed to translate: " + error.message });
	}
};

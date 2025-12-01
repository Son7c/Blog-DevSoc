import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { envKeys } from "../utils/envKeys.js";

export const protect = async (req, res, next) => {
	try {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, envKeys.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} else {
			res.status(401).json({ message: "Not authorized, no token" });
		}
	} catch (error) {
		res.status(401).json({ message: "Not authorized" });
	}
};

import axios from "axios";

const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
});

// Add a request interceptor to add the token to headers
API.interceptors.request.use(
	(config) => {
		try {
			const userStr = localStorage.getItem("user");
			if (userStr) {
				const user = JSON.parse(userStr);
				if (user && user.token) {
					config.headers.Authorization = `Bearer ${user.token}`;
				}
			}
		} catch (error) {
			console.error("Error parsing user from localStorage:", error);
			localStorage.removeItem("user");
		}
		return config;
	},
	(error) => {
		console.error("Request interceptor error:", error);
		return Promise.reject(error);
	},
);

// Add a response interceptor for better error handling
API.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			// Server responded with error status
			console.error("API Error:", error.response.status, error.response.data);
			console.error(
				"Request was:",
				error.config.method.toUpperCase(),
				error.config.url,
			);

			// If unauthorized, clear user data and redirect
			if (error.response.status === 401) {
				localStorage.removeItem("user");
				if (window.location.pathname !== "/login") {
					window.location.href = "/login";
				}
			}
		} else if (error.request) {
			// Request made but no response
			console.error("Network Error: No response from server");
			console.error(
				"Request was:",
				error.config?.method?.toUpperCase(),
				error.config?.url,
			);
		} else {
			// Something else happened
			console.error("Error:", error.message);
		}
		return Promise.reject(error);
	},
);

export default API;

import API from "../axios";

const register = async (userData) => {
	const response = await API.post("/users", userData);
	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}
	return response.data;
};

const login = async (userData) => {
	const response = await API.post("/users/login", userData);
	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}
	return response.data;
};

const logout = () => {
	localStorage.removeItem("user");
};

const authService = {
	register,
	login,
	logout,
};

export default authService;

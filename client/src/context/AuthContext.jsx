import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";
import { extractErrorMessage } from "../utils";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const register = async (userData) => {
        setIsLoading(true);
        setIsError(false);
        setIsSuccess(false);
        setMessage("");
        try {
            const data = await authService.register(userData);
            setUser(data);
            setIsSuccess(true);
        } catch (error) {
            const msg = extractErrorMessage(error);
            setMessage(msg);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        setIsLoading(true);
        setIsError(false);
        setIsSuccess(false);
        setMessage("");
        try {
            const data = await authService.login(userData);
            setUser(data);
            setIsSuccess(true);
        } catch (error) {
            const msg = extractErrorMessage(error);
            setMessage(msg);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsSuccess(false);
        setIsError(false);
        setMessage("");
    };

    const reset = () => {
        setIsLoading(false);
        setIsError(false);
        setIsSuccess(false);
        setMessage("");
    };

    const value = {
        user,
        isLoading,
        isError,
        isSuccess,
        message,
        register,
        login,
        logout,
        reset,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
		<Toaster
			position="top-center"
			toastOptions={{
				duration: 3000,
				style: {
					background: "#18181b",
					color: "#fff",
					padding: "16px",
					borderRadius: "12px",
					fontSize: "14px",
					fontWeight: "500",
				},
				success: {
					iconTheme: {
						primary: "#10b981",
						secondary: "#fff",
					},
				},
				error: {
					iconTheme: {
						primary: "#ef4444",
						secondary: "#fff",
					},
				},
			}}
		/>
	</React.StrictMode>,
);

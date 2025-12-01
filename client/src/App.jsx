import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateEditPost from "./pages/CreateEditPost";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="min-h-screen bg-zinc-100">
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						{/* Protected Routes */}
						<Route element={<ProtectedRoute />}>
							<Route path="/create-post" element={<CreateEditPost />} />
							<Route path="/edit-post/:id" element={<CreateEditPost />} />
						</Route>

						{/* 404 Route */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;

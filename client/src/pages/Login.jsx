import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { email, password } = formData;

	const navigate = useNavigate();
	const { login, isLoading, isError, isSuccess, message, user, reset } =
		useAuth();

	useEffect(() => {
		if (isError && message) {
			toast.error(message);
		}

		if (isSuccess && user) {
			toast.success("Welcome back!");
			navigate("/");
		}

		return () => {
			reset();
		};
	}, [user, isSuccess, isError, message, navigate, reset]);

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const userData = {
			email,
			password,
		};
		login(userData);
	};

	if (isLoading) {
		return <LoadingSpinner text="Signing in..." />;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<h2 className="text-4xl font-serif font-bold text-zinc-900 mb-2">
						Welcome Back
					</h2>
					<p className="text-zinc-600">Sign in to continue your journey</p>
				</div>

				<div className="bg-white rounded-3xl shadow-xl shadow-zinc-100/50 border border-zinc-100 p-8 sm:p-10">
					<form className="space-y-6" onSubmit={onSubmit}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-zinc-700 mb-2 uppercase tracking-wider"
							>
								Email Address
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={email}
								onChange={onChange}
								required
								className="input-field"
								placeholder="you@example.com"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-zinc-700 mb-2 uppercase tracking-wider"
							>
								Password
							</label>
							<input
								type="password"
								name="password"
								id="password"
								value={password}
								onChange={onChange}
								required
								className="input-field"
								placeholder="••••••••"
							/>
						</div>

						<button type="submit" className="w-full btn-primary">
							Sign In
						</button>
					</form>

					<div className="mt-8 text-center pt-6 border-t border-zinc-100">
						<p className="text-sm text-zinc-600">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="font-medium text-black hover:underline transition-all"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;

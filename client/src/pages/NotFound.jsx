import { Link } from "react-router";

const NotFound = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full text-center">
				<div className="mb-8">
					<h1 className="text-9xl font-serif font-bold text-zinc-200 mb-4">
						404
					</h1>
					<h2 className="text-3xl font-serif font-bold text-zinc-900 mb-4">
						Page Not Found
					</h2>
					<p className="text-zinc-600 text-lg">
						The page you are looking for doesn't exist or has been moved.
					</p>
				</div>
				<Link to="/" className="btn-primary inline-block">
					Go Back Home
				</Link>
			</div>
		</div>
	);
};

export default NotFound;

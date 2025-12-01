const LoadingSpinner = ({ text = "Loading..." }) => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-zinc-50">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
				<p className="mt-4 text-zinc-500 font-medium">{text}</p>
			</div>
		</div>
	);
};

export default LoadingSpinner;

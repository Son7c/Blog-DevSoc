import { useEffect } from "react";
import { Link } from "react-router";

const PostModal = ({
	post,
	onClose,
	onEdit,
	onDelete,
	currentUser,
	summary,
	translated,
	isLoadingAI,
	showTranslate,
	onSummarize,
	onTranslate,
	onToggleTranslate,
	onShowOriginal,
}) => {
	if (!post) return null;

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
			role="dialog"
			aria-modal="true"
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
				onClick={onClose}
			/>

			{/* Modal Content */}
			<div
				className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl transform transition-all duration-300 animate-in fade-in zoom-in-95"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all z-10 hover:cursor-pointer"
					aria-label="Close modal"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<div className="py-8 px-4 sm:p-12">
					{/* Header */}
					<header className="mb-8">
						<h1 className="text-4xl sm:text-5xl font-sans font-bold text-zinc-900 mb-6 leading-tight">
							{post.title}
						</h1>

						<div className="flex items-center gap-4">
							<div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center text-lg font-bold text-blue-600 ring-4 ring-white shadow-sm">
								{post.user?.name?.[0]?.toUpperCase() || "U"}
							</div>
							<div>
								<p className="font-medium text-zinc-900 text-lg font-domine">
									{post.user?.name || "Unknown Author"}
								</p>
								<div className="flex items-center gap-2 text-sm text-zinc-500">
									<time dateTime={post.createdAt}>
										{new Date(post.createdAt).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</time>
									<span>•</span>
									<span>{Math.ceil(post.content.length / 1000)} min read</span>
								</div>
							</div>
						</div>
					</header>

					{/* AI Toolbar */}
					<div className="flex flex-wrap items-center gap-3 mb-8 p-2 bg-zinc-50 rounded-2xl border border-zinc-100 w-fit">
						<button
							onClick={onSummarize}
							disabled={isLoadingAI}
							className={`
                inline-flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
									summary
										? "bg-blue-100 text-blue-700"
										: "bg-white text-zinc-700 hover:bg-white hover:shadow-md hover:text-blue-600"
								}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
							title={!currentUser ? "Login required" : ""}
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							{isLoadingAI ? "Thinking..." : "Summarize"}
							{!currentUser && (
								<svg
									className="w-3 h-3 text-zinc-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							)}
						</button>

						<div className="w-px h-6 bg-zinc-200 mx-1"></div>

						<button
							onClick={onToggleTranslate}
							className={`
                inline-flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
									showTranslate || translated
										? "bg-purple-100 text-purple-700"
										: "bg-white text-zinc-700 hover:bg-white hover:shadow-md hover:text-purple-600"
								}
              `}
							title={!currentUser ? "Login required" : ""}
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
								/>
							</svg>
							Translate
							{!currentUser && (
								<svg
									className="w-3 h-3 text-zinc-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							)}
						</button>

						{translated && (
							<button
								onClick={onShowOriginal}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-zinc-700 hover:bg-zinc-100 transition-all"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								Reset
							</button>
						)}
					</div>

					{/* Translation Options */}
					{showTranslate && (
						<div className="mb-8 animate-in slide-in-from-top-2 fade-in duration-200">
							<p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 ml-1">
								Select Language
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
								{[
									"Spanish",
									"French",
									"German",
									"Hindi",
									"Bengali",
									"Japanese",
								].map((lang) => (
									<button
										key={lang}
										onClick={() => onTranslate(lang)}
										disabled={isLoadingAI}
										className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all disabled:opacity-50 hover:cursor-pointer"
									>
										{lang}
									</button>
								))}
							</div>
						</div>
					)}

					{/* AI Summary Display */}
					{summary && (
						<div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-white border border-blue-100 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
							<div className="relative flex items-start gap-4">
								<div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-2">
										AI Summary
										<span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]">
											Beta
										</span>
									</h3>
									<p className="text-blue-900/80 leading-relaxed text-lg font-medium font-serif">
										{summary}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Content */}
					<div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-zinc-700 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-500">
						<div className="whitespace-pre-wrap text-lg font-domine leading-8 text-zinc-800">
							{translated?.content || post.content}
						</div>
					</div>

					{/* Actions */}
					{currentUser && currentUser._id === post.user?._id && (
						<div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-zinc-100">
							<button
								onClick={() => onEdit(post._id)}
								className="flex-1 inline-flex justify-center items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all hover:scale-[1.01] active:scale-[0.98] hover:cursor-pointer"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								Edit Story
							</button>
							<button
								onClick={() => onDelete(post._id)}
								className="flex-1 inline-flex justify-center items-center gap-2 bg-white text-red-600 border border-red-200 px-8 py-4 rounded-full font-medium hover:bg-red-50 hover:border-red-300 transition-all hover:scale-[1.01] active:scale-[0.98] hover:cursor-pointer"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete Story
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostModal;

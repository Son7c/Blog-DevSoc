import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import PostModal from "../components/PostModal";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../axios";
import postService from "../services/postService";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../utils";

const Home = () => {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState("");

	const { user } = useAuth();
	const navigate = useNavigate();
	const [selectedPost, setSelectedPost] = useState(null);
	const [summary, setSummary] = useState("");
	const [translated, setTranslated] = useState(null);
	const [isLoadingAI, setIsLoadingAI] = useState(false);
	const [showTranslate, setShowTranslate] = useState(false);

	const [retry, setRetry] = useState(0);

	useEffect(() => {
		const getPosts = async () => {
			setIsLoading(true);
			setIsError(false);
			setMessage("");
			try {
				const data = await postService.getPosts();
				setPosts(data);
			} catch (error) {
				const msg = extractErrorMessage(error);
				setMessage(msg);
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		getPosts();
	}, [retry]);

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this story?")) {
			try {
				await postService.deletePost(id);
				setPosts(posts.filter((post) => post._id !== id));
				setSelectedPost(null);
				toast.success("Story deleted successfully!");
			} catch (error) {
				toast.error("Failed to delete story");
			}
		}
	};

	const handleEdit = (id) => {
		setSelectedPost(null);
		navigate(`/edit-post/${id}`);
	};

	const handleSummarize = async () => {
		if (!user) {
			toast.error("Please login to use the summarize feature");
			return;
		}
		if (!selectedPost) return;
		setIsLoadingAI(true);
		try {
			const response = await API.post("/ai/summarize", {
				title: selectedPost.title,
				content: selectedPost.content,
			});
			setSummary(response.data.summary);
			toast.success("Summary generated successfully!");
		} catch (error) {
			const errorMsg =
				error.response?.data?.message || "Failed to generate summary";
			toast.error(errorMsg);
		} finally {
			setIsLoadingAI(false);
		}
	};

	const handleTranslate = async (language) => {
		if (!user) {
			toast.error("Please login to use the translate feature");
			return;
		}
		if (!selectedPost) return;
		setIsLoadingAI(true);
		try {
			const response = await API.post("/ai/translate", {
				title: selectedPost.title,
				content: selectedPost.content,
				targetLanguage: language,
			});
			setTranslated(response.data);
			setShowTranslate(false);
			toast.success(`Translated to ${language} successfully!`);
		} catch (error) {
			const errorMsg = error.response?.data?.message || "Failed to translate";
			toast.error(errorMsg);
		} finally {
			setIsLoadingAI(false);
		}
	};

	const closeModal = () => {
		setSelectedPost(null);
		setSummary("");
		setTranslated(null);
		setShowTranslate(false);
	};

	if (isLoading) {
		return <LoadingSpinner text="Loading stories..." />;
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-zinc-50">
				<div className="text-center max-w-md mx-auto px-4">
					<h2 className="text-2xl font-serif font-bold text-zinc-900 mb-2">
						Unable to load stories
					</h2>
					<p className="text-red-500 mb-6">{message}</p>
					<button
						onClick={() => setRetry((prev) => prev + 1)}
						className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-50 pt-24 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-15">
				<div className="text-center max-w-4xl mx-auto">
					<h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-zinc-900 mb-4 leading-tight tracking-tight">
						Discover stories that <br className="hidden sm:block" />
						<span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-900 to-zinc-600">
							matter to you.
						</span>
					</h1>
					<p className="text-[16px] sm:text-xl text-zinc-600 mb-10 leading-relaxed max-w-2xl mx-auto">
						A curated space for writers, thinkers, and creators to share their
						most profound ideas with the world.
					</p>
					{!user && (
						<Link
							to="/register"
							className="bg-black text-white px-10 py-3 rounded-full text-lg font-medium hover:bg-zinc-900 transition-all hover:scale-102 active:scale-95 shadow-xl hover:shadow-2xl inline-block duration-200"
						>
							Start Writing
						</Link>
					)}
					{user && (
						<Link
							to="/create-post"
							className="font-domine text-lg font-medium w-fit bg-zinc-900 px-8 py-3 rounded-full text-white flex gap-1 hover:gap-4 mx-auto transition-all duration-200 shadow-xl hover:shadow-2xl"
						>
							Write a story <span>&rarr;</span>
						</Link>
					)}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-1 text-2xl font-sans font-bold text-zinc-900">
					Latest Stories
				</h2>

				{posts.length === 0 ? (
					<div className="text-center py-24 bg-white rounded-3xl border border-zinc-100">
						<h3 className="text-2xl font-serif font-semibold text-zinc-900 mb-3">
							No stories yet
						</h3>
						<p className="text-zinc-500 mb-8 max-w-md mx-auto">
							The canvas is empty. Be the first to paint it with your words.
						</p>
						{user && (
							<Link
								to="/create-post"
								className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors inline-block"
							>
								Write a Story
							</Link>
						)}
					</div>
				) : (
					<div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{[...posts]
							.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
							.map((post) => (
								<article
									key={post._id}
									onClick={() => setSelectedPost(post)}
									className="group bg-white rounded-3xl border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 cursor-pointer hover:-translate-y-1"
								>
									<div className="p-4 sm:p-8 h-full flex flex-col">
										<div className="flex items-center gap-3 mb-6">
											<div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500">
												{post.user?.name?.[0]?.toUpperCase() || "U"}
											</div>
											<div className="text-sm">
												<p className="font-medium font-domine text-zinc-900">
													{post.user?.name || "Unknown Author"}
												</p>
												<p className="text-zinc-500">
													{new Date(post.createdAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
														},
													)}
												</p>
											</div>
										</div>

										<h3 className="text-2xl font-sans font-bold text-zinc-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
											{post.title}
										</h3>

										<p className="text-zinc-600 font-domine line-clamp-3 mb-6 grow leading-relaxed">
											{post.content}
										</p>

										<div className="flex items-center justify-between pt-6 border-t border-zinc-50 mt-auto">
											<span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
												Read story &rarr;
											</span>
											<span className="text-xs font-medium text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full">
												{Math.ceil(post.content.length / 1000)} min read
											</span>
										</div>
									</div>
								</article>
							))}
					</div>
				)}
			</div>

			{/* Modal */}
			<PostModal
				post={selectedPost}
				onClose={closeModal}
				onEdit={handleEdit}
				onDelete={handleDelete}
				currentUser={user}
				summary={summary}
				translated={translated}
				isLoadingAI={isLoadingAI}
				showTranslate={showTranslate}
				onSummarize={handleSummarize}
				onTranslate={handleTranslate}
				onToggleTranslate={() => setShowTranslate(!showTranslate)}
				onShowOriginal={() => setTranslated(null)}
			/>
		</div>
	);
};

export default Home;

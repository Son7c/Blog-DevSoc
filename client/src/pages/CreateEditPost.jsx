import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import postService from "../services/postService";
import { useAuth } from "../context/AuthContext";

const CreateEditPost = () => {
	const [formData, setFormData] = useState({
		title: "",
		content: "",
	});

	const [isLoading, setIsLoading] = useState(false);
	const { title, content } = formData;
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		const fetchPost = async () => {
			if (id) {
				setIsLoading(true);
				try {
					const post = await postService.getPost(id);
					setFormData({
						title: post.title,
						content: post.content,
					});
				} catch (error) {
					toast.error("Failed to fetch story");
					navigate("/");
				} finally {
					setIsLoading(false);
				}
			}
		};

		fetchPost();
	}, [id, navigate]);

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (id) {
				await postService.updatePost(id, { title, content });
				toast.success("Story updated successfully!");
			} else {
				await postService.createPost({ title, content });
				toast.success("Story published successfully!");
			}
			navigate("/");
		} catch (error) {
			const message =
				error.response?.data?.message ||
				error.message ||
				"Failed to save story";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<LoadingSpinner text={id ? "Saving changes..." : "Publishing story..."} />
		);
	}

	return (
		<div className="min-h-screen bg-zinc-50 pt-24 pb-12">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-10 text-center">
					<h1 className="text-4xl sm:text-5xl font-serif font-bold text-zinc-900 mb-4">
						{id ? "Edit Story" : "Tell Your Story"}
					</h1>
					<p className="text-xl text-zinc-600">
						{id
							? "Refine your thoughts and update your readers."
							: "Share your ideas, knowledge, and creativity with the world."}
					</p>
				</div>

				<form
					onSubmit={onSubmit}
					className="bg-white rounded-3xl shadow-xl shadow-zinc-100/50 border border-zinc-100 p-8 sm:p-12 space-y-8"
				>
					<div className="space-y-2">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-zinc-700 uppercase tracking-wider"
						>
							Title
						</label>
						<input
							type="text"
							name="title"
							id="title"
							value={title}
							onChange={onChange}
							required
							className="w-full px-0 py-4 border-b-2 border-zinc-100 text-3xl sm:text-4xl font-sans font-bold text-zinc-900 focus:border-black focus:outline-none transition-colors placeholder-zinc-300"
							placeholder="Enter a captivating title..."
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="content"
							className="block text-sm font-medium text-zinc-700 uppercase tracking-wider"
						>
							Content
						</label>
						<textarea
							id="content"
							name="content"
							rows={15}
							value={content}
							onChange={onChange}
							required
							className="w-full px-6 py-6 bg-zinc-50 rounded-2xl border-0 text-l font-domine text-zinc-800 leading-relaxed focus:ring-2 focus:ring-black/5 transition-all resize-y placeholder-zinc-400"
							placeholder="Start writing your story here..."
						/>
						<div className="flex justify-end">
							<p className="text-sm text-zinc-400 font-medium">
								{content.length} characters
							</p>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-zinc-100">
						<button
							type="button"
							onClick={() => navigate("/")}
							className="w-full sm:w-auto btn-secondary"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="w-full sm:w-auto btn-primary ml-auto"
						>
							{id ? "Save Changes" : "Publish Story"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateEditPost;

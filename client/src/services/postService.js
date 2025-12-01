import API from "../axios";

const getPosts = async () => {
    const response = await API.get("/posts");
    return response.data;
};

const getPost = async (id) => {
    const response = await API.get(`/posts/${id}`);
    return response.data;
};

const createPost = async (postData) => {
    const response = await API.post("/posts", postData);
    return response.data;
};

const updatePost = async (id, postData) => {
    const response = await API.put(`/posts/${id}`, postData);
    return response.data;
};

const deletePost = async (id) => {
    const response = await API.delete(`/posts/${id}`);
    return response.data;
};

const postService = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
};

export default postService;

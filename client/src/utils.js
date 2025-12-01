export const extractErrorMessage = (error) => {
    return (
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
    );
};

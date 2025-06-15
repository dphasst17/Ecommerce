export const uploadImagePostToS3 = async (file: any) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/upload/posts`, {
        method: "POST",
        body: file,
    }).then((res) => {
        return res.json();
    });
};
export const uploadImageProductToS3 = async (file: any) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/upload/product`, {
        method: "POST",
        body: file,
    }).then((res) => {
        return res.json();
    });
}
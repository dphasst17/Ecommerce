export const getAllComment = async (name: "post" | "product") => {
    return await fetch(`${import.meta.env.VITE_REACT_APP_URL}/comment/${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
}
export const deleteComment = async (token: string, name: string, id: number) => {
    return await fetch(`${import.meta.env.VITE_REACT_APP_URL}/comment/${name}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
        .then((res) => res.json())
}
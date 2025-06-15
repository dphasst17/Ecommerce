export const postCreate = async (data: any, token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};
export const categoryCreate = async (data: { [key: string]: string | number }, token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
}
export const getCategory = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/category`)
        .then((res) => res.json());
}

export const postGetAll = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post`)
        .then((res) => res.json());
}
export const postGetOne = async (id: number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/detail/${id}`)
        .then((res) => res.json());
}
export const removePost = async (token: string, id: number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: id }),
    }).then((res) => res.json());
}
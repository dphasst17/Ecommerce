export const getLogs = (token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/logs`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    ).then((res) => res.json());
}
export const deleteLogs = (token: string, id: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/logs/${id}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    ).then((res) => res.json());
}
export const productGetAllType = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/types`)
        .then(res => res.json())
}
export const productGetAll = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product`)
        .then(res => res.json())
}
export const productGetByType = async (type: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/type/${type}`)
        .then(res => res.json())
}
export const productGetDetail = async (obj: { type: string, idProduct: number }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/detail/${obj.idProduct}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: obj.type, role: "user" })
    })
        .then(res => res.json())
}
export const productGetNew = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/new`)
        .then(res => res.json())
}
export const productGetByKey = async (key: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/search/${key}`)
        .then(res => res.json())
}
export const getSaleEvent = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/sale`)
        .then(res => res.json())
}
export const getColByType = async (type: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/col/${type}`)
        .then(res => res.json())
}
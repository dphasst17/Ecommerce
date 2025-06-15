export const statisticalRevenue = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/revenue`)
        .then(res => res.json())
}
export const statisticalProduct = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/product`)
        .then(res => res.json())
}
export const statisticalUser = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/user`)
        .then(res => res.json())
}
export const statisticalOrder = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/order`)
        .then(res => res.json())
}
export const statisOrderList = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/order/list`)
        .then(res => res.json())
}
export const statistocalOrderCount = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/order/count`)
        .then(res => res.json())
}
export const statisticalCommentPost = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/comment/post`)
        .then(res => res.json())
}
export const statisticalCommentProduct = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/statistical/comment/product`)
        .then(res => res.json())
}

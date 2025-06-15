export const getOrder = async (token: string, total?: number, page?: number, limit?: number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order?${total ? `total=${total}&&` : ''}page=${page ? page : 1}&limit=${limit ? limit : 20}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
};
export const createOrder = async (token: string, data: { order: any[], detail: { idProduct: number, discount: number, countProduct: number }[] }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order/admin`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const getOrderByRoleShipper = async (token: string, total?: number, page?: number, limit?: number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order/shipper?${total ? `total=${total}&&` : ''}page=${page ? page : 1}&limit=${limit ? limit : 20}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}
export const getOrderById = async (token: string, id: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order/detail/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}
export const updateStatusOrder = async (token: string, data: {
    id: string, product: { idProduct: number, countProduct: number }[] | null,
    data_update: [{ orderStatus: string, idShipper?: string }]
}) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
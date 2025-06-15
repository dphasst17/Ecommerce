import { OrderInsertType } from "../types/type"

export const orderInsert = async (token: string, data: OrderInsertType) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const getOrderByUser = async (token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order/user`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}
export const getPurchaseOrder = async (token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order/purchase`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}
export const insertPayment = async (token: string, data: any) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order/payment`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())

}
export const deleteOrderItem = async (data: { idOrdDetail: number, idOrder: string }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/order`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
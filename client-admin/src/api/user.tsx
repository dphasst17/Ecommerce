import { CustomerUpdateType } from "../types/types"

export const getInfo = async (token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/admin`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}
export const getUser = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/u`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
}

export const getStaff = async (token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/s`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}
export const getShipper = async (token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/admin/shipper`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}
export const getAddress = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/address`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
}
export const updateStatus = async (token: string, data: { action: string, id: string }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/status`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const updateInfo = async (token: string, data: CustomerUpdateType) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
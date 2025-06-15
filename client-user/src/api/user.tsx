import { UserAddressAddType, UserUpdateType } from "types/type"

export const getUser = async (token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
}

export const updateUser = async (token: string, data: UserUpdateType) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const userAddress = async (token: string, data: UserAddressAddType) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/address`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const cartInsert = async (token: string, idProduct: number, countProduct: number, detail?: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/cart`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            cart: [
                {
                    idProduct: idProduct,
                    countProduct: countProduct,
                    detail: detail ? detail : ""
                }
            ]
        })
    })
        .then(res => res.json())
}
export const cartUpdate = async (idCart: number, count: number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/cart`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idCart,
            value: count
        })
    })
        .then(res => res.json())
}
export const cartRemove = async (listId: number[] | string[]) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/cart`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            listId: listId
        })
    })
        .then(res => res.json())

}
export const getApiProvince = async () => {
    return fetch('https://vapi.vnappmob.com/api/province/', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
}
export const getProvincesDetail = async (type: string, id: string) => {
    return fetch(`https://vapi.vnappmob.com/api/province/${type}/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
}

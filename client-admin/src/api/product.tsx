export const productGetAll = async (total?: number, page?: number, limit?: number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product?${total ? `total=${total}&&` : ''}page=${page ? page : 1}&&limit=${limit ? limit : 20}`)
        .then(res => res.json())
}
export const productGetDetail = async (obj: { nameType: string, idProduct: string | number }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/detail/${obj.idProduct}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: obj.nameType, role: "admin" })
    })
        .then(res => res.json())
}
export const productUpdate = async (token: string, data: { tableName: string, condition: { name: string, value: string | number }, data_update: any }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const imageUpdate = async (token: string, data: { [key: string]: string | number }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/image`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const eventProductGetAll = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/sale/product`)
        .then(res => res.json())
}
export const getColByType = async (type: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/col/${type}`)
        .then(res => res.json())
}
export const getAllCategoryProduct = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/types`)
        .then(res => res.json())
}
export const getCategorydetail = async (name: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/detail/type/${name}`)
        .then(res => res.json())
}

export const createProduct = async (data: any, token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const createImage = async (data: { type: string, img: string }[], token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const createCategory = async (data: any, token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/type`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const createEvent = async (data: any, token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/sale`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const updateEvent = async (data: { idSale?: number, idDetail?: number, sale: { [x: string]: string }[], detail?: { discount: number }[] }, token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/sale`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const deleteEvent = async (id: number, token: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/sale/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idSale: id })
    })
        .then(res => res.json())
}
export const getSaleEvent = async () => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/sale/all`)
        .then(res => res.json())
}
export const getSaleDetail = async (id: number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/sale/detail/${id}`)
        .then(res => res.json())
}
export const columnChange = async (data: { method: string, table: string, colAdd?: { name: string, datatypes: string, isNull: boolean, limit: number }[], colDel?: string[] }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/table`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const columnDelete = async (token: string, data: { id: string, table: string, col: string }) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/type/col`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}
export const removeCategory = async (token: string, type: string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/product/type/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: type })
    })
        .then(res => res.json())
}
export const getCommentByProduct = async(idProduct:number,page?:number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/comment/detail/${idProduct}/${page ? page : 1}`)
    .then(res => res.json())
}
export const insertComment = async(token:string,data:any) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/comment`,{
        method:'Post',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    })
    .then(res => res.json())
}
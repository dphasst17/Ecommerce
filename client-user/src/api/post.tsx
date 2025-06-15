export const postGetAll = async() => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post`)
    .then(res => res.json())
}
export const commentPostInsert = async(token:string,data:{idPost:number,commentValue:string,created_date:string}[]) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/comment`,{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    })
    .then(res => res.json())
}
export const getCommentByPost = async(id:number,page?:number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/comment/${id}/${page ? page : 1}`)
    .then(res => {
        if(res.status === 500){
         throw new Error()
        }
        return res.json()
    })
}
export const postGetDetail = async(id:number) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/detail/${id}`)
    .then(res => res.json())
}
export const postGetCategory = async() => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/post/category`)
    .then(res => res.json())
}
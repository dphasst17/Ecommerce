import * as apiProduct from "../api/product"
import * as apiUser from "../api/user"
import * as apiOrder from "../api/order"
import * as apiComment from "../api/comment"
import * as apiPosts from "../api/post"
import { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/state";
const productApi = apiProduct as Record<string, any>;
const userApi = apiUser as Record<string, any>;
const postsApi = apiPosts as Record<string, any>;
const orderApi = apiOrder as Record<string, any>;
const commentApi = apiComment as Record<string, any>;

const handleCheckTypeGet = (type: string, fName: any, key?: any) => {
    let url;
    switch (type) {
        case 'product':
            url = !key ? productApi[fName] : productApi[fName](key)
            break;
        case 'user':
            url = !key ? userApi[fName] : userApi[fName](key)
            break;
        case 'post':
            url = !key ? postsApi[fName] : postsApi[fName](key)
            break;
        case 'order':
            url = !key ? orderApi[fName] : orderApi[fName](key)
            break;
        case 'comment':
            url = !key ? commentApi[fName] : commentApi[fName](key)
            break;
        default:
            console.log(false);
            break;
    }
    return url;
}

export const useFetchData = (type: string, fName: string) => {
    const { setIsLoading } = useContext(StateContext)
    const [data, setData] = useState<any | null>(null);
    const [err, setErr] = useState<any | null>(null)
    const url = handleCheckTypeGet(type, fName);
    useEffect(() => {
        setIsLoading(true)
        url().then((res: any) => {
            if (res.status === 500) {
                throw Error(`Message: ${res.messages}`);
            }
            setData(res)
            setIsLoading(false)

        })
            .catch((err: any) => {
                setErr(err)
            })
    }, [url])
    return { data, err };
}
export const useFetchDataByKey = (type: string, fName: string, key: any) => {
    const { setIsLoading } = useContext(StateContext)
    const [data, setData] = useState<any | null>(null);
    const [err, setErr] = useState<any | null>(null)
    useEffect(() => {
        setIsLoading(true)
        const url = handleCheckTypeGet(type, fName, key);
        url.then((res: any) => {
            if (res.status === 500) {
                throw Error(`Message: ${res.messages}`);
            }
            setData(res)
            setIsLoading(false)
        })
            .catch((err: any) => {
                setErr(err)
            })
    }, [])
    return { data, err };
}
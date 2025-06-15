import { createContext, useEffect, useState } from "react";
import { CategoryType, OrderDetailType, OrderType } from "../types/type";
import Cookies from "js-cookie";

export const StateContext = createContext<any>({});
export const StateProvider = ({ children }: { children: React.ReactNode }) => {
    const [order, setOrder] = useState<OrderType | null>(null);
    const [purchase, setPurchase] = useState<OrderDetailType[] | null>(null)
    const [isLogin, setIsLogin] = useState<boolean>(JSON.parse(Cookies.get('u-login') || 'false'))
    const [product, setProduct] = useState<any[] | null>(null)
    const [sale, setSale] = useState<any[] | null>(null)
    const [type, setType] = useState<CategoryType[] | null>(null)
    const [newProduct, setNewProduct] = useState<any[] | null>(null)
    const [post, setPost] = useState<any[] | null>(null)
    const [postCate, setPostCate] = useState<any[] | null>(null)
    const [listCheckOut, setListCheckOut] = useState<number[] | []>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        const userLogin = JSON.parse(Cookies.get('u-login') || 'false')
        setIsLogin(userLogin)
    }, [])
    return (
        <StateContext.Provider value={{
            order, setOrder,
            purchase, setPurchase,
            product, setProduct,
            sale, setSale,
            type, setType,
            newProduct, setNewProduct,
            post, setPost,
            postCate, setPostCate,
            isLoading, setIsLoading,
            isLogin, setIsLogin,
            listCheckOut, setListCheckOut
        }}>
            {children}
        </StateContext.Provider>
    )
}
import { useFetchData } from "../hooks/useFetchData";
import { createContext, useContext, useEffect } from "react";
import { StateContext } from "./stateContext";
import { productGetByType } from "../api/product";
import { GetToken } from "../utils/token";
import { getUser } from "../api/user";
import { getOrderByUser, getPurchaseOrder } from "../api/order";
import { userStore } from "../store/user";

export const ApiContext = createContext({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const { setPurchase,setOrder,setSale, isLogin, setPost, setNewProduct, setProduct, setType,setPostCate } = useContext(StateContext)
    const {setStoreUser} = userStore()
    const { data: dataType } = useFetchData('product', 'productGetAllType')
    const { data: dataSale } = useFetchData('product', 'getSaleEvent')
    const { data: newProduct } = useFetchData('product', 'productGetNew')
    const { data: postAll } = useFetchData('posts', 'postGetAll')
    const { data: categoryPost} = useFetchData('posts', 'postGetCategory')
    useEffect(() => { dataSale && setSale(dataSale.data) }, [dataSale])
    useEffect(() => {
        if (dataType) {
            setType(dataType.data);
            const tempProduct: any[] = [];
            Promise.all(dataType.data.map((e: any) => productGetByType(e.nameType)
                .then(res => tempProduct.push({ idType: e.idType, type: e.nameType, data: res.data }))))
                .then(() => {
                    setProduct((prevProduct: any) => (prevProduct !== null ? [...prevProduct, ...tempProduct] : [...tempProduct]));
                });
        }
    }, [dataType])
    useEffect(() => {
        newProduct && setNewProduct(newProduct.data)
        postAll && setPost(postAll.data)
        categoryPost && setPostCate(categoryPost.data)
    }, [newProduct, postAll, categoryPost])
    useEffect(() => {
        const fetchUser = async () => {
            const token = await GetToken()
            token && (
                getUser(token)
                    .then(res => {
                        res.status === 200 && setStoreUser(res.data)
                    }),
                getOrderByUser(token)
                .then(res => {
                    res.status === 200 && setOrder(res.data)
                }),
                getPurchaseOrder(token)
                .then(res => {
                    res.status === 200 && setPurchase(res.data)
                })
            )
        }
        if (isLogin) {
            fetchUser()
        }
    }, [isLogin])
    return (
        <ApiContext.Provider value={{}}>
            {children}
        </ApiContext.Provider>
    )
}
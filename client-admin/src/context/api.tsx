import { createContext, useContext, useEffect } from "react";
import { statisticalOrder, statisticalProduct, statisticalRevenue, statisticalUser, statisOrderList } from "../api/statistical";
import { StateContext } from "./state";
import { useFetchData, useFetchDataByKey } from "../hooks/useFetchData";
import { productStore } from "../store/product";
import { GetToken } from "../utils/token";
import { getAddress, getInfo, getShipper, getStaff, getUser } from "../api/user";
import { userStore } from "../store/user";
import { getOrder, getOrderByRoleShipper } from "../api/order";

export const ApiContext = createContext<any>({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const { position, role, isLogin, setPosition, setPost, setTypePost, setStatistical, setSale, setOrder, setShipper, setComment } = useContext(StateContext)
    const { setCategory, setProduct } = productStore()
    const { setUser, setStaff, setCurrentUser, setAddress } = userStore()
    useEffect(() => {
        const fetchStatistical = async () => {
            //cPostdata is comment_post_data and cProductData is comment_product_data
            const [productData, userData, revenueData, orderData,orderList] = await Promise.all([
                statisticalProduct(),
                statisticalUser(),
                statisticalRevenue(),
                statisticalOrder(),
                statisOrderList()
            ])
            if (productData.status === 200 && userData.status === 200
                && revenueData.status === 200 && orderData.status === 200
                && orderList.status === 200) {
                setStatistical({
                    product: productData.data,
                    user: userData.data,
                    revenue: revenueData.data,
                    order: orderData.data,
                    orderList: orderList.data
                });
            }
        }
        fetchStatistical()
    }, [])
    const { data: dataProduct } = useFetchData('product', 'productGetAll')
    const { data: categoryData } = useFetchData('product', 'getAllCategoryProduct')
    const { data: SaleData } = useFetchData('product', 'getSaleEvent')
    const { data: dataPost } = useFetchData('post', 'postGetAll')
    const { data: postCategory } = useFetchData('post', 'getCategory')
    const { data: commentProductData } = useFetchDataByKey('comment', 'getAllComment', 'product')
    const { data: commentPost } = useFetchDataByKey('comment', 'getAllComment', 'post')

    useEffect(() => {
        dataProduct && setProduct(dataProduct.data)
        categoryData && setCategory(categoryData.data)
        SaleData && setSale(SaleData.data)
        dataPost && setPost(dataPost.data)
        postCategory && setTypePost(postCategory.data)
        commentProductData && setComment((prevState: any) => ({ ...prevState, product: commentProductData.data }))
        commentPost && setComment((prevState: any) => ({ ...prevState, post: commentPost.data }))
    }, [dataProduct, categoryData, SaleData, dataPost, postCategory, commentProductData, commentPost])

    useEffect(() => {
        const fetchData = async () => {
            const token = await GetToken()
            token && (
                getInfo(token).then(res => {
                    if (res.status === 200) {
                        setCurrentUser(res.data)
                        setPosition(res.data[0].position_name ? res.data[0].position_name : "admin")
                    }
                }),
                getStaff(token).then(res => {
                    if (res.status === 200) {
                        setStaff(res.data)
                    }
                }),
                getShipper(token).then(res => {
                    if (res.status === 200) {
                        setShipper(res.data)
                    }
                }),
                getUser().then(res => {
                    if (res.status === 200) {
                        setUser(res.data)
                    }
                }),
                getAddress()
                    .then(res => {
                        if (res.status === 200) {
                            setAddress(res.data)
                        }
                    })
            )

        }
        isLogin && fetchData()
    }, [isLogin, role])
    //Fetch Order
    useEffect(() => {
        const fetchOrder = async () => {
            const token = await GetToken();
            if (token) {
                const fetchFunction = role === 1 && position === "shipper" ? getOrderByRoleShipper : getOrder
                const res = await fetchFunction(token);
                if (res.status === 200) {
                    setOrder(res.data);
                }
            }
        };
        isLogin && fetchOrder();
    }, [isLogin, role, position]);

    return (
        <ApiContext.Provider value={{
        }}>
            {children}
        </ApiContext.Provider>
    )
}

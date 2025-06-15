import { createContext, useCallback, useEffect, useState } from "react";
import { CartType, ProductType } from "../types/type";
import { cartInsert, cartRemove, cartUpdate } from "../api/user";
import { GetToken } from "../utils/token";
import { userStore } from "../store/user";
import { toast } from 'react-toastify';
import _ from "lodash";
export const CartContext = createContext<any>({});
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = userStore()
    const [cart, setCart] = useState<CartType[] | null>(null)
    useEffect(() => { user && setCart(user[0]?.cart) }, [user])
    const addItemCart = (data: ProductType) => {
        const getId = cart && cart.filter((f: CartType) => f.idProduct === data.idProduct)
        if (getId?.length !== 0) {
            getId && updateCount(getId[0]?.idCart, getId[0]?.countProduct + 1)
        } else {
            //add new item
            const insertData = async () => {
                const token = await GetToken()
                token && cartInsert(token, data.idProduct, 1)
                    .then((res: any) => {
                        if (res.status === 201) {
                            toast.success("Add item success")
                            const dataCart: CartType = {
                                idCart: res.data.idCart,
                                idProduct: data.idProduct,
                                countProduct: 1,
                                detail: [{
                                    discount: Number(data.discount),
                                    imgProduct: data.imgProduct as string,
                                    nameProduct: data.nameProduct,
                                    price: Number(data.price),
                                    total: Number(data.total)
                                }]
                            }
                            cart && setCart([dataCart, ...cart])
                        }
                    })
            }
            insertData()

        }

    }
    const debounceUpdate = useCallback(_.debounce((idCart: number, count: number) => {
        cartUpdate(idCart, count)
            .then(res => {
                if (res.status !== 200) {
                    // Xử lý lỗi nếu cần
                    cart && setCart(cart.map((c: CartType) => {
                        return {
                            ...c,
                            countProduct: c.idCart === idCart ? count - 1 : c.countProduct
                        };
                    }));
                }
            });
    }, 500), []);

    const updateCount = (idCart: number, count: number) => {
        // Cập nhật trạng thái ở đây
        cart && setCart(cart.map((c: CartType) => {
            return {
                ...c,
                countProduct: c.idCart === idCart ? count : c.countProduct
            }
        }));

        // Gọi hàm debounce đã được khai báo
        debounceUpdate(idCart, count);
    };

    const removeItemCart = (listId: number[]) => {
        cartRemove(listId)
            .then(res => {
                if (res.status === 200) {
                    cart && setCart(cart.filter((c: CartType) => !listId.includes(c.idCart)))
                }
            })
    }
    return (
        <CartContext.Provider value={{
            cart, addItemCart, updateCount, removeItemCart
        }}>
            {children}
        </CartContext.Provider>
    )
}
import { Button, DatePicker, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from "@nextui-org/react"
import { productStore } from "../../store/product"
import { useContext, useEffect, useState } from "react"
import { ProductType, ShipperType } from "../../types/types"
import { FiMinus, FiPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { StateContext } from "../../context/state";
import { GetToken } from "../../utils/token";
import { createOrder } from "../../api/order";
interface ProductOrderType {
    idProduct: number,
    nameProduct: string,
    imgProduct: string,
    count: number,
    discount: number,
    price: number,
}
const ModalOrder = () => {
    const { product } = productStore()
    const { shipper, order, setOrder } = useContext(StateContext)
    const { register, handleSubmit } = useForm()
    const [delivery, setDelivery] = useState<string | null>(null)
    const [edd, setEdd] = useState<string | null>(null)
    const [productList, setProductList] = useState<string[] | null>(null)
    const [productOrder, setProductOrder] = useState<ProductOrderType[]>([])
    const [idShipper, setIdShipper] = useState<string | null>(null)
    const handleSlectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProductList(Array.from(e.target.value.split(",")));
    };
    const handleUpdateCountProduct = (idProduct: number, count: number) => {
        productOrder && setProductOrder(productOrder.map((p: ProductOrderType) => p.idProduct === idProduct ? { ...p, count } : p))
    }
    useEffect(() => {
        productList && product && setProductOrder(
            product.data.filter((f: ProductType) =>
                productList.includes(f.idProduct.toString())
            ).map((p: ProductType) => ({
                idProduct: p.idProduct,
                nameProduct: p.nameProduct,
                imgProduct: p.imgProduct || "",
                count: 1,
                discount: p.discount || 0,
                price: p.price
            }))
        );
    }, [productList, product])

    const onSubmit = async (data: any) => {
        !delivery && alert("Select delivery method")
        delivery === "home" && !edd && alert("Select date")
        !productList && alert("Select product")
        const dataOrder = [{
            idShipper: idShipper,
            fullName: data.name,
            phone: data.phone,
            address: data.address || "",
            costs: delivery === "home" ? 0.85 : 0,
            edd: edd || new Date().toISOString().split("T")[0],
            method: "Payment on delivery",
            paymentStatus: "paid",
            orderStatus: delivery === "home" ? "shipping" : "success",
            note: data.note,
        }]
        const dataDetail = productOrder && productOrder.map((p: ProductOrderType) => ({
            idProduct: p.idProduct,
            countProduct: p.count,
            discount: p.discount,
        }))
        const token = await GetToken()
        token && createOrder(token, { order: dataOrder, detail: dataDetail })
            .then(res => {
                alert(res.message)
                if (res.status === 201) {
                    setOrder([...order, {
                        idOrder: res.data.id,
                        fullName: data.name,
                        phone: data.phone,
                        address: data.address || "",
                        created_at: res.data.date,
                        method: "Payment on delivery",
                        paymentStatus: "paid",
                        orderStatus: delivery === "home" ? "shipping" : "success",
                    }])
                }
            })
            .catch(err => console.log(err))

    }

    return <ModalContent>
        {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1">Store create new order</ModalHeader>
                <ModalBody className="grid grid-cols-2 gap-2 max-h-[700px] overflow-y-auto">
                    <Input {...register('name', { required: true })} label="Full name" />
                    <Input {...register('phone', { required: true })} label="Phone" />

                    <Select
                        label="Delivery method"
                        color="primary"
                        onChange={e => setDelivery(e.target.value)}
                        size="lg"
                        className="w-[100%]"
                    >
                        <SelectItem key="store">Pick up in store</SelectItem>
                        <SelectItem key="home">Home delivery</SelectItem>
                    </Select>

                    {
                        delivery && delivery === "home" && <>
                            <Input {...register('address', { required: true })} label="Address" />
                            <DatePicker onChange={e => setEdd(`${e.year}-${e.month}-${e.day}`)}
                                label={"Delivery date"} />
                            <Select
                                onChange={(e: any) => { setIdShipper(e.target.value) }}
                                label="Shipper"
                                classNames={{ popoverContent: 'text-white' }}>
                                {shipper && shipper.map((s: ShipperType) => <SelectItem key={s.idStaff}>{s.name}</SelectItem>)}
                            </Select>
                        </>
                    }
                    {product && <Select
                        label="Product"
                        color="primary"
                        selectionMode="multiple"
                        selectedKeys={productList || []}
                        onChange={e => handleSlectProduct(e)}
                        size="lg"
                        className="w-[100%] col-span-1"
                    >
                        {product.data.map((p: ProductType) => <SelectItem key={p.idProduct}
                            startContent={<img className="size-10 object-contain" src={p.imgProduct} alt={p.imgProduct} />}
                        >{p.nameProduct}</SelectItem>)}
                    </Select>}
                    <Textarea
                        {...register('note')}
                        label="Note"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Enter your note"
                        className="col-span-2"
                    />
                    <div className="product-list col-span-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {
                            productOrder.length !== 0 && productOrder.map((p: ProductOrderType) => <div className="h-[250px] flex flex-wrap gap-2 items-center">
                                <div className="img w-full h-2/4 flex items-center justify-center">
                                    <img className="w-full h-full object-contain" src={p.imgProduct} alt={p.imgProduct} />
                                </div>
                                <div className="content w-full h-2/4">
                                    <div className="name text-center">{p.nameProduct}</div>
                                    <div className="price">${p.price}</div>
                                    <div className="discount">Discount: -{p.discount}%</div>
                                    <div className="w-full flex justify-start count">
                                        <div className="flex items-center justify-center">
                                            <Button isIconOnly color="primary" size="sm" onClick={() => p.count < 2 ? null : handleUpdateCountProduct(p.idProduct, p.count - 1)} >
                                                <FiMinus className="text-2xl cursor-pointer" />
                                            </Button>
                                            <div className="w-10 h-10 flex items-center justify-center">{p.count}</div>
                                            <Button isIconOnly color="primary" size="sm" onClick={() => handleUpdateCountProduct(p.idProduct, p.count + 1)} >
                                                <FiPlus className="text-2xl cursor-pointer" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="success" className="text-white" onClick={handleSubmit(onSubmit)}>
                        Create Order
                    </Button>
                </ModalFooter>
            </>
        )}
    </ModalContent>
}

export default ModalOrder
import { Button, Card, CardBody, Select, SelectItem, Tab, Tabs, Textarea } from "@nextui-org/react";
import { useContext, useState } from "react";
import { FaPhoneAlt, FaRegEdit, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { RxDragHandleDots2 } from "react-icons/rx";
import { OrderStatusType } from ".";
import { CiExport } from "react-icons/ci";
import { IoPrintOutline } from "react-icons/io5";
import { HiOutlineDuplicate } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { StateContext } from "../../context/state";
import { OrderDetailType, OrderType, ShipperType, StatusValueType } from "../../types/types";
import { ShipperNextValue, statusNextValue } from "../../utils/utils";
import { updateStatusOrder } from "../../api/order";
import { GetToken } from "../../utils/token";

interface PropsDetail {
    id: string,
    info: {
        fullName: string
        phone: string
        address: string
        note: string
        idShipper: string
    }[]
    setInfo: React.Dispatch<React.SetStateAction<any>>

    detail: any[] | null,
    setDetail: React.Dispatch<React.SetStateAction<any[] | null>>,

    btnSubmit: boolean,
    setBtnSubmit: React.Dispatch<React.SetStateAction<boolean>>

    currentStatus: string | null,
    setCurrentStatus: React.Dispatch<React.SetStateAction<string | null>>

    isEdit: boolean,
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
}
const OrderDetail = ({ id, info, setInfo, detail, currentStatus, setDetail, btnSubmit, setBtnSubmit, setCurrentStatus, isEdit, setIsEdit }: PropsDetail) => {
    const { shipper, position, order, setOrder, isDark } = useContext(StateContext)
    const [nextStatus, setNextStatus] = useState<string | null>(null)
    const [note, setNote] = useState<string>("")
    const [idShip, setIdShip] = useState<string>("")
    const orderStatus: OrderStatusType[] = [
        {
            value: "pending",
            label: "Pending"
        },
        {
            value: "prepare",
            label: "Prepare"
        },
        {
            value: "shipping",
            label: "Shipping"
        },
        {
            value: "delivery",
            label: "Delivery"
        },
        {
            value: "success",
            label: "Success"
        },
        {
            value: "failed",
            label: "Failed"
        }
    ]
    const handleChangeStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value
        const dataFilter = position === 'shipper' ? ShipperNextValue : statusNextValue
        const dataChange = dataFilter.filter((f: StatusValueType) => f.next === nextValue).map((s: StatusValueType) => s.current === currentStatus)[0]
        setNextStatus(nextValue)
        setBtnSubmit(dataChange)
    }

    const handleUpdateStatus = async () => {
        let isFetch = true
        nextStatus === "shipping" && !idShip && (alert("Select shipper"), isFetch = false)
        nextStatus === "failed" && !note && (alert("Enter note"), isFetch = false)
        const token = await GetToken()
        let dataUpdate: { orderStatus: string, [x: string]: string } = {
            orderStatus: nextStatus!
        }
        if (nextStatus === "shipping") {
            dataUpdate.idShipper = idShip;
            isFetch = true
        }

        if (nextStatus === "failed") {
            dataUpdate.note = note
            isFetch = true
        }
        const listProduct = detail && detail.map((f: OrderDetailType) => ({
            idProduct: f.idProduct,
            countProduct: f.countProduct
        }))
        isFetch && token && nextStatus && id && updateStatusOrder(token, {
            id: id,
            product: (nextStatus === "failed" || nextStatus === "delivery") && detail ? listProduct : null,
            data_update: [dataUpdate]
        })
            .then(res => {
                alert(res.message)
                if (res.status === 200) {
                    setBtnSubmit(false)
                    setCurrentStatus(nextStatus)
                    setNextStatus(null)
                    setIdShip("")
                    setOrder({ ...order, data: order.data.map((ord: OrderType) => ord.idOrder === id ? { ...ord, ...dataUpdate } : ord) })
                    setInfo(info.map((inf: any) => ({ ...inf, ...dataUpdate })))
                }
            })
            .catch(err => console.log(err))
    }

    return <div className={`order-detail-data h-full col-span-1 pt-14 flex flex-wrap justify-center content-start ${detail ? "scale-100" : "scale-0"} transition-all`}>
        <div className="detail-top-bar w-4/5 h-[40px] flex justify-between bg-zinc-950 rounded-t-md">
            <div className="w-4/5 h-full flex items-center text-white">
                <RxDragHandleDots2 className="w-5 h-5 mr-2" />
                Order #{id}
            </div>
            <div onClick={() => { setDetail(null); setBtnSubmit(false) }} className="w-[30px] h-full flex items-center justify-center text-white cursor-pointer">
                <IoMdClose className="w-5 h-5" />
            </div>
        </div>
        <div className="detail-body w-4/5 h-auto min-h-[400px] bg-white">
            <div className="order-info w-full h-auto flex flex-col justify-start">
                {info && info.map((i: any) => <div className="w-full h-auto flex flex-wrap justify-center content-start p-1">
                    <div className="w-[99%] h-auto my-1">
                        <div className="w-full h-full flex items-center justify-start text-zinc-950 text-[15px] font-bold">
                            <FaUser className="w-5 h-5 text-zinc-700 mr-2" /> {i.fullName}
                        </div>
                    </div>
                    <div className="w-[99%] h-auto my-1">
                        <div className="w-full h-full flex items-center justify-start text-zinc-950 text-[15px] font-bold">
                            <FaPhoneAlt className="w-5 h-5 text-zinc-700 mr-2" /> {i.phone}
                        </div>
                    </div>
                    <div className="w-[99%] h-auto my-1">

                        <div className="w-full h-full flex items-center justify-start text-zinc-950 text-[15px] font-bold">
                            <FaLocationDot className="w-5 h-5 text-zinc-700 mr-2" /> {i.address}
                        </div>
                    </div>
                </div>)}
                <div className="items w-full h-auto flex flex-col mt-2 px-2">
                    <Tabs variant="underlined" aria-label="Options" classNames={{ tabContent: "!text-black !hover:text-black !text-[18px]", cursor: "!bg-black" }}>
                        <Tab key="items" title="Order Items">
                            <Card classNames={{ base: "bg-transparent shadow-none" }}>
                                <CardBody className="border-b border-solid border-zinc-500">
                                    {detail && detail.map((d: OrderDetailType) => <div className="relative w-full h-auto flex flex-wrap justify-center content-start p-1">
                                        {d.discount !== 0 && <div className="absolute w-[60px] h-[20px] top-1 right-1 text-white bg-red-600 rounded-sm flex justify-center items-center">-{d.discount}%</div>}
                                        <div className="images w-[60px] h-[60px] flex items-center justify-center">
                                            <img src={d.imgProduct} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="content w-[80%] h-auto min-h-[50px] text-zinc-900">
                                            <div className="product-name w-full h-auto">
                                                {d.nameProduct}
                                            </div>
                                            <div className="price w-full h-auto">
                                                {d.countProduct} x $ {d.discount !== 0 && <span className="line-through text-red-500">{d.price}</span>} {d.price - (d.price * d.discount / 100)}
                                            </div>
                                        </div>
                                    </div>)}
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="more" title="More">
                            <Card classNames={{ base: "bg-transparent shadow-none" }}>
                                <CardBody className="border-b border-solid border-zinc-500">
                                    {info && info.map((i: any) => <div className="w-full h-auto flex flex-wrap justify-center content-start p-1 text-zinc-950" key={`${id}-more`}>
                                        <div className="w-full h-auto flex flex-wrap justify-between items-center">
                                            <span>Shipper</span>
                                            <span>{i.idShipper}</span>
                                        </div>
                                        <div className="w-full h-auto flex flex-wrap justify-between items-center">
                                            <span>Note</span>
                                            <Textarea isReadOnly value={i.note} />
                                        </div>
                                    </div>)}
                                </CardBody>
                            </Card>
                        </Tab>

                    </Tabs>
                    <div className="w-full h-auto flex flex-wrap justify-between items-center p-1 text-zinc-950">
                        <span>Total</span>
                        <span>${detail && detail.map((d: any) => (d.price - (d.price * d.discount / 100)) * d.countProduct).reduce((a: any, b: any) => a + b, 0)}</span>
                    </div>
                    <div className="w-full h-auto flex flex-wrap justify-between items-center p-1 text-zinc-950">
                        <span>Shipping status</span>
                        <span className="flex items-center">
                            {currentStatus} <FaRegEdit onClick={() => setIsEdit(!isEdit)} className="ml-2 cursor-pointer text-green-500" />
                        </span>
                    </div>
                </div>
                {isEdit && <div className="w-full h-[auto min-h-[50px] flex flex-wrap items-center justify-between px-2">
                    {currentStatus && <Select
                        onChange={(e: any) => { handleChangeStatus(e) }}
                        classNames={{ mainWrapper: 'h-[30px]', trigger: '!h-[30px] !min-h-[30px]', popoverContent: isDark ? 'text-white' : 'text-black' }}
                        className="w-1/4 "
                        defaultSelectedKeys={[currentStatus]}
                        size="sm" radius="sm">
                        {orderStatus.map((o: OrderStatusType) =>
                            <SelectItem className={`${isDark ? "text-white" : "text-black"}}`} key={o.value}>{o.label}</SelectItem>
                        )}
                    </Select>}
                    {nextStatus === "shipping" && btnSubmit && <Select
                        onChange={(e: any) => { setIdShip(e.target.value) }}
                        className="w-2/5 mx-1"
                        size="sm" radius="sm"
                        classNames={{ mainWrapper: 'h-[30px]', trigger: '!h-[30px] !min-h-[30px]', popoverContent: isDark ? 'text-white' : 'text-black' }}>
                        {shipper && shipper.map((s: ShipperType) => <SelectItem key={s.idStaff}>{s.name}</SelectItem>)}
                    </Select>}
                    <div className="w-[35%] h-[50px] flex items-center justify-start">
                        {btnSubmit && <Button onClick={handleUpdateStatus} size="sm" color="success" className="w-3/5 h-[30px] text-[15px] text-white">Update</Button>}
                        {!btnSubmit && <Button size="sm" color="success" className="w-3/5 h-[30px] bg-transparent mx-1"></Button>}
                        <Button isIconOnly size="sm" color="danger" className="mx-1" onClick={() => { setIsEdit(false); setBtnSubmit(false); }}>
                            <IoMdClose className="w-3/5 h-3/5" />
                        </Button>
                    </div>
                    {nextStatus === "failed" && btnSubmit && <Textarea
                        label="Note"
                        radius="sm"
                        onChange={(e: any) => { setNote(e.target.value) }}
                        placeholder="Enter your note"
                        className="w-full h-[60px] mb-4"
                    />}
                </div>}
            </div>
        </div>
        <div className="detail-bottom-bar w-4/5 h-[40px] flex items-center justify-between bg-zinc-950 text-white rounded-b-md p-1">
            <div className="w-[30%] h-full flex justify-center items-center border-r border-solid border-zinc-300 cursor-pointer">
                <CiExport className="mr-1" />
                <span>Export</span>
            </div>
            <div className="w-[30%] h-full flex justify-center items-center border-r border-solid border-zinc-300 cursor-pointer">
                <IoPrintOutline className="mr-1" />
                <span>Print</span>
            </div>
            <div className="w-[30%] h-full flex justify-center items-center border-r border-solid border-zinc-300 cursor-pointer">
                <HiOutlineDuplicate className="mr-1" />
                <span>Duplicate</span>
            </div>
            <div className="w-[10%] h-full flex justify-center items-center cursor-pointer">
                <BsThreeDots />
            </div>
        </div>
    </div>
}

export default OrderDetail
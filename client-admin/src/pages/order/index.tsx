import { useContext, useEffect, useState } from "react"
import { StateContext } from "../../context/state"
import { Button, Modal, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react"
import { OrderType } from "../../types/types"
//Import Icon
import { FcViewDetails } from "react-icons/fc";
//
import { GetToken } from "../../utils/token";
import { getOrder, getOrderById } from "../../api/order";
import ModalOrder from "./order.modal";
import OrderDetail from "./detail";
export interface OrderStatusType {
    value: string,
    label: string
}

const Order = () => {
    const { position, order, isDark } = useContext(StateContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [data, setData] = useState<OrderType[] | []>([])
    const [id, setId] = useState<string>("")
    const [detail, setDetail] = useState<any[] | null>(null)
    const [info, setInfo] = useState<any>([])
    const [currentStatus, setCurrentStatus] = useState<string | null>(null)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [activePage, setActivePage] = useState<number>(1)
    const [btnSubmit, setBtnSubmit] = useState<boolean>(false)

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
    useEffect(() => {
        order && setData(order.data)
    }, [order])
    const handleDetail = async (id: string) => {
        setIsEdit(false)
        setBtnSubmit(false)
        setId(id)
        const status = order.data.filter((ord: OrderType) => ord.idOrder === id)[0].orderStatus
        setCurrentStatus(orderStatus.filter((ord: OrderStatusType) => ord.value === status)[0].value)
        setInfo(order.data.filter((ord: OrderType) => ord.idOrder === id).map((ord: OrderType) => ({
            fullName: ord.fullName,
            phone: ord.phone,
            address: ord.address,
            note: ord.note,
            idShipper: ord.idShipper
        })))
        const token = await GetToken()
        token && getOrderById(token, id)
            .then(res => {
                res.status === 200 ? setDetail(res.data) : null
            })
            .catch(err => console.log(err))

    }
    const handlePagination = async (page: number) => {
        if (page === activePage) {
            return false
        }
        const token = await GetToken()
        setActivePage(page)
        order && page > 1 && getOrder(token, order.total, page, order.limit)
            .then(res => {
                if (res.status !== 200) {
                    return console.log(res.message)
                }
                setData(res.data.data)
            })

        order && page === 1 && setData(order.data)
    }
    return <div className={`w-full h-auto min-h-[95.6vh] grid grid-cols-3 gap-1 ${isDark ? "bg-[#1F1F1F] text-white" : "bg-[#F5F5F5] text-zinc-950"} p-2`}>
        <div className="order-data h-full col-span-2">
            <div className="w-full h-[80px] col-span-3 row-span-1 flex items-center justify-start">
                {position !== "shipper" && <Button onClick={onOpen} color="primary" radius="sm" size="sm">Create Order</Button>}
            </div>
            <Table classNames={{ th: ["bg-zinc-950 text-white text-[16px]"], wrapper: "bg-transparent !shadow-none", tr: ["!my-2"], td: ["!h-[60px]"] }}
                aria-label="Table Order Manager">
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DATE CREATED</TableColumn>
                    <TableColumn>PAYMENT</TableColumn>
                    <TableColumn>PAYMENT-STATUS</TableColumn>
                    <TableColumn>ORDER-STATUS</TableColumn>
                    <TableColumn>ACTION</TableColumn>
                </TableHeader>

                <TableBody>
                    {data && data.map((o: OrderType) =>
                        <TableRow key={`order-${o.idOrder}`}>
                            <TableCell>#{o.idOrder}</TableCell>
                            <TableCell>{o.fullName}</TableCell>
                            <TableCell>00-000-000</TableCell>
                           {/*  <TableCell>{o.created_at!.split("T")[0].split("-").reverse().join("/")}</TableCell> */}
                            <TableCell>{o.method}</TableCell>
                            <TableCell>{o.paymentStatus}</TableCell>
                            <TableCell><span className={` text-white
                ${(o.orderStatus === "prepare" || o.orderStatus === "shipping" || o.orderStatus === "delivery") && "bg-blue-500"}
                ${o.orderStatus === "pending" && "bg-yellow-500"} 
                ${o.orderStatus === "success" && "bg-green-500"} 
                ${o.orderStatus === "failed" && "bg-red-500"} p-1 rounded-md`}>{o.orderStatus}</span></TableCell>
                            <TableCell className="flex justify-around">
                                <Button isIconOnly size="sm" className="bg-transparent" onClick={() => handleDetail(o.idOrder)}><FcViewDetails className="w-5 h-5" /></Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {order && data && data.length > 0 && <Pagination onChange={(e: number) => handlePagination(e)} className="my-1" isCompact size="lg" showControls
                page={activePage} total={order.total_page} />}
        </div>


        <OrderDetail btnSubmit={btnSubmit} setBtnSubmit={setBtnSubmit} setCurrentStatus={setCurrentStatus} currentStatus={currentStatus} id={id}
            detail={detail} setDetail={setDetail}
            info={info} setInfo={setInfo} isEdit={isEdit} setIsEdit={setIsEdit}
        />


        <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalOrder />
        </Modal>
    </div >
}

export default Order

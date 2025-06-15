import { StateContext } from "../../context/stateContext"
import { useContext, useState } from "react"
import { Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { pagination } from "../../utils/utils"
import { MdCancelPresentation } from "react-icons/md";
import { deleteOrderItem } from "../../api/order";
import { toast } from "react-toastify";
const Order = () => {
    const { order, setOrder } = useContext(StateContext)
    const [activePage, setActivePage] = useState<number>(1)
    const handleDeleteItemOrder = (idOrdDetail: number, idOrder: string) => {
        deleteOrderItem({ idOrdDetail, idOrder }).then((res) => {
            res.status === 200 && setOrder(order.filter((o: any) => o.idOrdDetail !== idOrdDetail))
            res.status === 200 ? toast.success(res.message) : toast.error(res.message)
            setActivePage(1)
        })
    }
    return <div className="user-purchase w-full h-auto flex flex-wrap justify-center items-center p-1">
        <div className="product w-full h-auto flex flex-wrap justify-around content-start">
            <Table aria-label="TableOrder"
                className="text-zinc-900 w-full"
                classNames={{ wrapper: ['bg-transparent !shadow-none'], th: ['bg-[#242424] text-zinc-50 text-[18px]'] }}>
                <TableHeader>
                    <TableColumn>Id</TableColumn>
                    <TableColumn>Product Name</TableColumn>
                    <TableColumn>Image product</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>Payment Status</TableColumn>
                    <TableColumn>Order Status</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody>
                    {order && order.length > 0 ? order.slice((activePage * 5) - 5, activePage * 5).map((o: any, index: number) => <TableRow key={index}>
                        <TableCell>{o.idOrder}</TableCell>
                        <TableCell>{o.nameProduct} ({o.countProduct} item)</TableCell>
                        <TableCell><img src={o.imgProduct} className="w-20 h-20" /></TableCell>
                        <TableCell>{o.price * o.countProduct}</TableCell>
                        <TableCell>{o.paymentStatus}</TableCell>
                        <TableCell>{o.orderStatus}</TableCell>
                        <TableCell>
                            {(o.orderStatus === "pending" || o.orderStatus === "prepare") && <Tooltip radius="sm" content="Cancel Order" classNames={{ content: "text-zinc-950" }}>
                                <Button size="sm" isIconOnly color="danger" onClick={() => { handleDeleteItemOrder(o.idOrdDetail, o.idOrder) }}>
                                    <MdCancelPresentation className="text-xl" />
                                </Button>
                            </Tooltip>}
                        </TableCell>
                    </TableRow>)
                        :
                        <TableRow key="#not_order_yet">
                            <TableCell>#Not_order_yet</TableCell>
                            <TableCell>#</TableCell>
                            <TableCell>
                                #
                            </TableCell>
                            <TableCell>$0000</TableCell>
                            <TableCell>#</TableCell>
                            <TableCell>#</TableCell>
                            <TableCell>
                                <Tooltip radius="sm" content="Cancel Order" classNames={{ content: "text-zinc-950" }}>
                                    <Button size="sm" isIconOnly color="danger">
                                        <MdCancelPresentation className="text-xl" />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
            {order && order.length > 5 && <Pagination isCompact size="lg" showControls page={activePage}
                total={pagination(5, order.length)} initialPage={1} onChange={(e) => { setActivePage(e) }} />}
        </div>
    </div >
}

export default Order
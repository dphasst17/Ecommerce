import { useContext, useEffect, useState } from "react"
import { StateContext } from "../../context/state"
import { Image, Modal, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react"
import { EditIcon } from "../../components/icon/edit";
import { BiDetail } from "react-icons/bi";
import { ProductType } from "../../types/types";
import ModalDetail from "./modal/detail";
import ModalEdit from "./modal/edit";
import { EyeSlashFilledIcon } from "../../components/icon/eyeSlashFilledIcon";
import { EyeFilledIcon } from "../../components/icon/eyeFilledIcon";
import { productStore } from "../../store/product";
import { GetToken } from "../../utils/token";
import { productGetAll, productUpdate } from "../../api/product";
import { pagination } from "../../utils/utils";
import { toast } from "react-toastify";
const TableProduct = () => {
    const { isDark } = useContext(StateContext)
    const { product } = productStore()
    const [data, setData] = useState<ProductType[] | []>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [dataSelect, setDataSelect] = useState<{ id: number | string, nameType: string }>({ id: '', nameType: '' })
    const [activePage, setActivePage] = useState(1)
    const [modalName, setModalName] = useState("")
    const listModal = [
        {
            displayName: "Detail",
            modalDetail: ModalDetail
        },
        {
            displayName: "Edit",
            modalDetail: ModalEdit
        }
    ]
    useEffect(() => {
        product && setData(product.data)
    }, [product])
    const handleChangeStatus = async (id: number, status: "show" | "hide") => {
        const table = "products"
        const condition = {
            name: "idProduct",
            value: Number(id)
        }
        const dataUpdate = [{
            status: status
        }]
        const token = await GetToken()
        token && productUpdate(token, { tableName: table, condition: condition, data_update: dataUpdate })
            .then(res => {
                res.status === 200 ? toast.success(res.message) : toast.error(res.message)
                res.status === 200 && product && setData(product.data.map((p: ProductType) => p.idProduct === id ? { ...p, action: status } : p))
            })
            .catch(err => console.log(err))
    }
    const handlePagination = (page: number) => {
        if (page === activePage) {
            return false
        }
        setActivePage(page)
        product && page > 1 && productGetAll(product.total, page, product.limit)
            .then(res => {
                if (res.status !== 200) {
                    return console.log(res.message)
                }
                setData(res.data.data)
            })

        product && page === 1 && setData(product.data)
    }
    return <div className="table_product w-[90%] h-auto flex flex-wrap justify-center items-center my-2">
        <Table aria-label="Product table" className="relative  min-h-[1000px] mb-2">
            <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>IMAGES</TableColumn>
                <TableColumn>NAME</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>BRAND</TableColumn>
                <TableColumn>DISCOUNT</TableColumn>
                <TableColumn>TOTAL</TableColumn>
                <TableColumn>View</TableColumn>
                <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody className="!z-0">
                {
                    data && data.map((p: ProductType) =>
                        <TableRow className={`${isDark ? "text-zinc-50" : "text-zinc-950"}`} key={p.idProduct}>
                            <TableCell>{p.idProduct}</TableCell>
                            <TableCell><Image width={50} alt={`${p.nameProduct}-img`} src={p.imgProduct} /></TableCell>
                            <TableCell>{p.nameProduct}</TableCell>
                            <TableCell>{p.price}</TableCell>
                            <TableCell>{p.nameType}</TableCell>
                            <TableCell>{p.brand}</TableCell>
                            <TableCell>{p.discount}</TableCell>
                            <TableCell>{p.total}</TableCell>
                            <TableCell>{p.view}</TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-around gap-2">
                                    <Tooltip className={`${isDark ? "text-zinc-50" : "text-zinc-950"}`} content="Details">
                                        <span onClick={() => { onOpen(); setDataSelect({ id: p.idProduct, nameType: p.nameType! }); setModalName("Detail") }} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <BiDetail />
                                        </span>
                                    </Tooltip>
                                    <Tooltip className={`${isDark ? "text-zinc-50" : "text-zinc-950"}`} content="Edit">
                                        <span onClick={() => { onOpen(); setDataSelect({ id: p.idProduct, nameType: p.nameType! }); setModalName("Edit") }} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <EditIcon />
                                        </span>
                                    </Tooltip>
                                    <Tooltip color="danger" content={p.action === "hide" ? "Show" : "Hide"}>
                                        <span onClick={() => { handleChangeStatus(p.idProduct, p.action === "hide" ? "show" : "hide") }} className="text-lg text-zinc-500 cursor-pointer active:opacity-50">
                                            {p.action === "show" ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                                        </span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                }
            </TableBody>

        </Table>
        {product && <Pagination isCompact size="lg" showControls page={activePage} total={pagination(product.limit, product.total)}
            initialPage={1} onChange={(e: any) => { handlePagination(e) }} />}
        <Modal
            isOpen={isOpen}
            onOpenChange={() => { onOpenChange(); setModalName("") }}
            backdrop="opaque"
            placement="center"
            size="5xl"
            className="h-full xl:h-[90%]"
            classNames={{ wrapper: "overflow-hidden" }}
        >
            {listModal.filter((f: any) => f.displayName === modalName).map((m: any) =>
                <m.modalDetail setModalName={setModalName} id={dataSelect.id} nameType={dataSelect.nameType} key={`Modal-${m.displayName}`} />
            )}
        </Modal>
    </div>
}

export default TableProduct
import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { StateContext } from "../../../context/state";
import { useContext, useEffect, useState } from "react";
import { useFetchDataByKey } from "../../../hooks/useFetchData";
import { DeleteIcon } from "../../../components/icon/delete";
import { IoCloseSharp } from "react-icons/io5";
import { GetToken } from "../../../utils/token";
import { columnChange, columnDelete, createCategory, productUpdate, removeCategory } from "../../../api/product";
import { useForm } from "react-hook-form";
import { productStore } from "../../../store/product";
import { toast } from "react-toastify";
interface FormEditType {
    id: string,
    name: string
}
interface ColTable {
    name: string, datatypes: string, isNull: boolean, limit: number
}
const ModalCateDetail = ({ name }: { name: string }) => {
    const { isDark } = useContext(StateContext)
    const { category, setCategory } = productStore()
    const { register, handleSubmit } = useForm()
    const { data } = useFetchDataByKey('product', 'getCategorydetail', name)
    const [dataCate, setDataCate] = useState<any[] | null>(null)
    const [idEdit, setIdEdit] = useState<string | null>(null)
    const [addCol, setAddCol] = useState<{ add: boolean, colNumber: number[] }>({ add: false, colNumber: [1] })
    const [formEdit, setFormEdit] = useState<FormEditType | null>(null)
    useEffect(() => {
        data && setDataCate(data.data)
    }, [data])
    useEffect(() => {
        category && console.log(category)
    }, [category])
    const handleChangeName = async (currentName: string) => {
        if (formEdit) {
            if (formEdit.name.toLocaleLowerCase() === currentName.toLocaleLowerCase()) {
                setIdEdit(null);
                setFormEdit(null)
                return;
            }
            const token = await GetToken()
            const data = {
                tableName: 'typedetail',
                condition: {
                    name: 'id',
                    value: formEdit.id
                },
                data_update: [{
                    displayname: formEdit.name.toLocaleLowerCase()
                }]
            }
            token && productUpdate(token, data).then(res => res.status === 200 && (alert(res.message), setIdEdit(null), setFormEdit(null)))
        }

    }
    const handleAddCol = async (data: { [x: string]: string | number }) => {
        if (addCol.colNumber.length === 0) {
            setAddCol({ add: false, colNumber: [1] })
            return false
        }
        const token = await GetToken()
        const colRowInsert = addCol.colNumber.map((n: number, index: number) => ({
            name: data[`name-${n}`],
            displayname: data[`displayname-${n}`],
            displayorder: dataCate && dataCate[0].detail.length + (index + 1),
            datatypes: data[`option${n}`],
            type: name,
        }))
        const colTableInsert: ColTable[] = addCol.colNumber.map((n: number) => ({
            name: String(data[`name-${n}`]),
            datatypes: String(data[`option${n}`]),
            isNull: true,
            limit: Number(data[`limit-${n}`])
        }))
        columnChange({ method: 'add', table: name, colAdd: colTableInsert })
            .then(res => console.log(res.message))
        token && createCategory({ table: colRowInsert }, token)
            .then(res => {
                const dataAppend = colRowInsert.map((c: any) => ({
                    ...c,
                    id: `${c.type}${c.name}`
                }))
                res.status === 200 ? toast.success(res.message) : toast.error(res.message)
                setAddCol({ add: false, colNumber: [1] })
                res.status === 200 && dataCate && setDataCate(dataCate.map((d: any) => ({ ...d, detail: [...d.detail, ...dataAppend] })))
            })
    }
    const handleDelCol = async (table: string, id: string, col: string) => {
        const token = await GetToken()
        token && columnDelete(token, { id, table, col })
            .then(res => {
                res.status === 200 ? toast.success(res.message) : toast.error(res.message)
                res.status === 200 && dataCate && setDataCate(dataCate.map((d: any) => ({ ...d, detail: d.detail.filter((d: any) => d.id !== id) })))
            })
    }
    const handleDeleteTable = async (nameType: string, onClose: () => void) => {
        const token = await GetToken()
        token && removeCategory(token, nameType)
            .then(res => {
                res.status === 200 ? toast.success(res.message) : toast.error(res.message)
                res.status === 200 && (
                    category && setCategory(category.filter((d: any) => d.nameType !== nameType)),
                    onClose()
                )
            })
    }
    return <ModalContent>
        {(onClose) => (
            <>  <ModalHeader className="flex flex-col gap-1">#{dataCate && dataCate[0].idType} {name.toLocaleUpperCase()}</ModalHeader>
                <ModalBody key="Modal-add-category"
                    className={`w-full h-screen overflow-y-auto flex flex-row flex-wrap justify-between gap-2 ${isDark ? "text-zinc-50" : "text-zinc-950"}`}>
                    <div className="">Total item: {dataCate ? dataCate[0].count : 0}</div>
                    {dataCate && dataCate[0].count === 0 &&
                        <Button size="sm" isIconOnly color="danger" onClick={() => handleDeleteTable(name, onClose)}>
                            <DeleteIcon className="text-[20px]" />
                        </Button>
                    }
                    <span className="w-full">Column</span>
                    <div className="w-full grid grid-cols-5 gap-2">
                        {dataCate && dataCate[0].count === 0 && <>
                            <Button size="sm" color="primary" className="text-white col-span-1"
                                onClick={() =>
                                    addCol.add === true
                                        ? setAddCol({ ...addCol, colNumber: [...addCol.colNumber, addCol.colNumber.length + 1] })
                                        : setAddCol({ ...addCol, add: true })}
                            >
                                Add Column
                            </Button>
                            {addCol.add && <>
                                <Button onClick={handleSubmit(handleAddCol)} size="sm" color="success" className="text-white col-span-1">Submit</Button>
                                <Button size="sm" color="warning" className="text-white col-span-1" onClick={() => setAddCol({ add: false, colNumber: [1] })}>Cancel</Button>
                            </>}
                        </>
                        }
                        <div className="w-full max-h-[270px] overflow-auto col-span-5">
                            {addCol.add && addCol.colNumber.map((c: number) => <div className="w-full grid grid-cols-12 gap-2 items-center my-2" key={`col-${c}`}>
                                <Input {...register(`name-${c}`, { required: true })} className="col-span-3" size="sm" label="Name" />
                                <Input {...register(`displayname-${c}`, { required: true })} className="col-span-2" size="sm" label="Displayname" />
                                {/* <Input {...register(`displayorder-${c}`, { required: true })} className="col-span-2" size="sm" label="Displayorder" /> */}
                                <select {...register(`option${c}`, { required: true })} className="col-span-2 h-full rounded-md">
                                    <option value="varchar">Text</option>
                                    <option value="integer">Number</option>
                                    <option value="date">Date</option>
                                </select>
                                <Input {...register(`limit-${c}`, { required: true })} className="col-span-2" size="sm" label="Limit" />
                                <Button className="col-span-1"
                                    onClick={() => setAddCol({ ...addCol, colNumber: addCol.colNumber.filter(e => e !== c) })}
                                    isIconOnly color="danger" size="sm">
                                    <IoCloseSharp className="text-[20px]" />
                                </Button>
                            </div>)}
                        </div>

                    </div>
                    <div className="column-detail w-full mx-auto px-4">
                        {dataCate && dataCate[0].detail?.map((item: any) => (
                            <div className={`grid grid-cols-4 gap-2 my-3`} key={item.id}>
                                <Input isReadOnly={idEdit === item.id ? false : true} onChange={e => formEdit && setFormEdit({ ...formEdit, name: e.target.value })} defaultValue={item.displayname.toLocaleUpperCase()} label="Display name" />
                                <Input isReadOnly defaultValue={item.datatypes} label="Data type" />
                                <Input isReadOnly defaultValue={item.displayorder} label="Display order" />
                                <div className="flex items-center justify-evenly">
                                    {(!idEdit || idEdit !== item.id) && <Button size="sm" color="primary"
                                        onClick={() => { setIdEdit(item.id); setFormEdit({ id: item.id, name: item.displayname }) }
                                        }>Edit</Button>}
                                    {(idEdit && idEdit === item.id) &&
                                        <>
                                            <Button className="text-white" size="sm" color="success" onClick={() => { handleChangeName(item.displayname) }}>Save</Button>
                                            <Button className="text-white" size="sm" color="warning" onClick={() => { setIdEdit(null) }}>Close</Button>
                                        </>
                                    }

                                    {dataCate[0].count === 0 &&
                                        <Button size="sm" isIconOnly color="danger" onClick={() => handleDelCol(name, item.id, item.name.toLowerCase())}>
                                            <DeleteIcon className="text-[20px]" />
                                        </Button>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={() => { onClose() }}>
                        Close
                    </Button>
                </ModalFooter>
            </>
        )}
    </ModalContent>
}

export default ModalCateDetail
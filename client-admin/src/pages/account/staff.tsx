import { Avatar, Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react"
import { userStore } from "../../store/user"
import { StaffType } from "../../types/types"
import { StateContext } from "../../context/state"
import { useContext, useState } from "react"
import { CiCalendarDate } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineUpdate } from "react-icons/md";
import { useForm } from "react-hook-form"
import { GetToken } from "../../utils/token"
import { createStaff } from "../../api/auth"
import { toast } from "react-toastify"
const Staff = ({ handleChangeStatus }: { handleChangeStatus: (type: "users" | "staff", id: string, status: "active" | "block") => Promise<void> }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { isDark } = useContext(StateContext)
    const { staff } = userStore()

    return <div className="staff w-[95%] md:w-2/5 h-auto min-h-[250px] flex flex-col pt-1 rounded-md">
        <div className="title w-full h-[50px] flex justify-between items-center px-2">
            <span className={`text-[25px] font-bold ${isDark ? "text-white" : "text-zinc-950"}`}>Staff</span>
            <Button color="primary" radius="sm" size="sm" onPress={onOpen}>Create a new Staff Account</Button>
        </div>
        <div className="staff-content w-full grid grid-cols-2 gap-y-2 gap-x-4 px-2">
            {staff && staff.map((s: StaffType) => <div key={s.idStaff} className="rounded-md bg-zinc-50 h-[150px] grid grid-cols-3 shadow-md cursor-pointer hover:scale-105 transition-all">
                <div className="avatar h-full flex flex-wrap content-center items-center justify-center col-span-1">
                    <Avatar className="" src={s.avatar} size="lg" radius="sm" color="primary" />
                    <p className="text-zinc-950 font-bold">#{s.idStaff}</p>
                </div>
                <div className="relative detail h-full col-span-2 text-zinc-950 flex flex-col justify-start items-start py-1">
                    <div className="w-full flex justify-end px-1">
                        <Chip onClick={() => handleChangeStatus("staff", s.idStaff!, s.action === "active" ? "block" : "active")} radius="sm" variant="bordered" color={s.action === "active" ? "success" : "danger"}>{s.action}</Chip>
                    </div>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-zinc-700">{s.email}</p>
                    <p className="text-zinc-700">{s.position_name}</p>
                    <p className="text-zinc-700 flex">
                        <CiCalendarDate className="mr-2 text-[20px]" />
                        {s.created_at!.split("T")[0].split("-").reverse().join("/")}</p>
                    <p className="text-zinc-700 flex">
                        <MdOutlineUpdate className="mr-2 text-[20px]" />
                        {s.updated_at!.split("T")[0].split("-").reverse().join("/")}</p>
                </div>
            </div>)}
        </div>
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="4xl"
        >
            <ModalAddStaff />
        </Modal>

    </div>
}

const ModalAddStaff = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [staffCount, setStaffCount] = useState<number[]>([1])
    const { isDark, } = useContext(StateContext)
    const { setStaff, staff } = userStore()
    const handleChangeCountStaff = (type: string, id?: number) => {
        type === "add" ? setStaffCount((prev: number[]) => [...prev, prev.length + 1]) : setStaffCount((prev: number[]) => prev.filter((s: number) => s !== id))
    }
    const onSubmit = async (data: { [key: string]: string }) => {

        const dataCopy = [...staffCount]
        const created_date = new Date().toISOString().split("T")[0]
        const updated_date = new Date().toISOString().split("T")[0]
        const staffData = dataCopy.map((s: number) => ({
            username: data[`username-${s}`],
            password_hash: data[`password-${s}`],
            idUser: data[`username-${s}`],
            role: 1,
            status: "active"
        }))
        const infoData = dataCopy.map((s: number) => ({
            name: data[`name-${s}`],
            email: data[`email-${s}`],
            phone: data[`phone-${s}`],
            idStaff: data[`username-${s}`],
            created_at: created_date,
            updated_at: updated_date
        }))
        const positionData = dataCopy.map((s: number) => ({
            idStaff: data[`username-${s}`],
            position_name: data[`position-${s}`]
        }))
        const token = await GetToken()
        token && createStaff(token, { staff: staffData, info: infoData, position: positionData })
            .then(res => {
                if (res.status === 201) {
                    const dataAppend = dataCopy.map((s: number, i: number) => ({
                        idStaff: data[`username-${s}`],
                        name: data[`name-${s}`],
                        email: data[`email-${s}`],
                        phone: data[`phone-${s}`],
                        position_name: data[`position-${s}`],
                        created_at: new Date(created_date).toISOString(),
                        updated_at: new Date(updated_date).toISOString(),
                        action: "active",
                        avatar: "",
                        birthday: "",
                        address: "",
                        position_id: res.data.firtId + i
                    }))
                    toast.success("Create staff success")
                    staff && setStaff([...staff, ...dataAppend])
                }
            })
            .catch(err => console.log(err))
    }
    return <ModalContent >
        {(onClose) => <>
            <ModalHeader className="flex flex-col justify-center gap-1">
                <p className={`${isDark ? "text-white" : "text-zinc-950"} text-center`}>Create a new staff account</p>
                <Button isIconOnly color="primary" onClick={() => handleChangeCountStaff("add")}><FaUserPlus className="text-[20px]" /></Button>
            </ModalHeader>
            <ModalBody key="Modal-add-staff" className="grid grid-cols-2 gap-2 max-h-[500px] overflow-auto">
                {
                    staffCount.map((s: number) => <div className="col-span-1" key={s}>
                        <p className={`${isDark ? "text-white" : "text-zinc-950"}`}>Staff #{s}</p>
                        <div className="w-full grid grid-cols-1 gap-2">
                            <Input {...register(`username-${s}`, { required: true })} label="Username"
                                type="text"
                                className={`${errors[`username-${s}`] && "border-red-500"} border border-solid`}
                                radius="sm"
                            />

                            <Input {...register(`password-${s}`, { required: true })} label="Password"
                                type="password"
                                className={`${errors[`password-${s}`] && "border-red-500"} border border-solid`}
                                radius="sm"
                            />

                            <Input {...register(`name-${s}`, { required: true })} label="Name"
                                type="text"
                                className={`${errors[`name-${s}`] && "border-red-500"} border border-solid`}
                                radius="sm"
                            />

                            <Input {...register(`phone-${s}`, { required: true })} label="Phone"
                                type="text"
                                className={`${errors[`phone-${s}`] && "border-red-500"} border border-solid`}
                                radius="sm"
                            />

                            <Input {...register(`email-${s}`, { required: true })} label="Email"
                                type="email"
                                className={`${errors[`email-${s}`] && "border-red-500"} border border-solid`}
                                radius="sm"
                            />
                            <Select classNames={{ popoverContent: `${isDark ? "text-white" : "text-zinc-950"}` }} label="Position" {...register(`position-${s}`, { required: true })}>
                                <SelectItem key="staff">Staff</SelectItem>
                                <SelectItem key="shipper">Shipper</SelectItem>
                            </Select>
                        </div>
                    </div>)
                }
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSubmit(onSubmit)()}>Create Staff</Button>
                <Button color="danger" variant="light" onPress={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </>}
    </ModalContent>
}

export default Staff
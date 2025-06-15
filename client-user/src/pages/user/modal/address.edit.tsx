import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { userStore } from "../../../store/user";
import { getApiProvince, getProvincesDetail, userAddress } from "../../../api/user";
import { GetToken } from "../../../utils/token";
import { UserAddressAddType } from "../../../types/type";
import { toast } from "react-toastify";
interface ResultAddress {
    provinces: string;
    districts: string;
    wards: string;
    details: string;
    [key: string]: string;
}
const ModalEditAddress = ({ idAddress, address }: { idAddress: number, address: string }) => {
    const { updated_address } = userStore()
    const [current, setCurrent] = useState<string>("")
    const [province, setProvince] = useState<any | null>(null);
    const [idProvinces, setIdProvinces] = useState<string | null>(null);
    const [district, setDistrict] = useState<any | null>(null);
    const [idDistrict, setIdDistrict] = useState<string | null>(null);
    const [ward, setWard] = useState<any | null>(null);
    const [resultAddress, setResultAddress] = useState<ResultAddress>({ provinces: '', districts: '', wards: '', details: '' })
    useEffect(() => {
        setCurrent(address)
        getApiProvince()
            .then(res => setProvince(res.results))
    }, [address])
    useEffect(() => {
        resultAddress.provinces && setCurrent(`${resultAddress.details}, ${resultAddress.wards}, ${resultAddress.districts}, ${resultAddress.provinces}`)
    }, [resultAddress])

    useEffect(() => {
        idProvinces !== null && getProvincesDetail('district', idProvinces).then(res => setDistrict(res.results))
        idDistrict !== null && getProvincesDetail('ward', idDistrict).then(res => setWard(res.results))
    }, [idProvinces, idDistrict])

    const submitData = async (onClose: () => void) => {
        const keyArr = Object.keys(resultAddress)
        const isInvalid = keyArr.filter(key => resultAddress[key] === "");
        if (isInvalid.length !== 0) {
            alert(`Please enter ${isInvalid.toString()}`)
            return
        }
        if (address === current) {
            onClose()
            return
        }
        const token = await GetToken()
        const dataAddNew: UserAddressAddType = {
            type: "update",
            dataOperation: {
                detail: `${resultAddress.details}, ${resultAddress.wards}, ${resultAddress.districts}, ${resultAddress.provinces}`,
            },
            id: idAddress
        }
        token && userAddress(token, dataAddNew)
            .then(res => {
                if (res.status === 200) {
                    toast.success("Update address is success")
                    updated_address({ ...dataAddNew.dataOperation, id: idAddress })
                    onClose()
                }
            })
    }

    return <ModalContent>
        {(__onClose) => <>
            <ModalHeader className="flex flex-col gap-1 text-zinc-950">
                <span className="text-[20px] font-bold">Edit Address</span>
                <span className="text-[15px]">Address: {current}</span>
            </ModalHeader>
            <ModalBody>
                <form className="w-full text-zinc-900">
                    <Select
                        label="Select Your City"
                        size="sm"
                        radius="sm"
                        classNames={{ listbox: ['text-zinc-900'] }}
                        className={`rounded-md my-2`}
                        color={resultAddress.provinces !== "" ? 'success' : 'primary'}
                        defaultSelectedKeys={[resultAddress.provinces]}
                        onChange={(e) => {
                            const selected = province.find((p: any) => p.province_id === e.target.value);
                            setIdProvinces(selected.province_id)
                            setResultAddress((data) => ({ ...data, provinces: selected.province_name }))
                        }}>

                        {province !== null && province.map((p: any) => <SelectItem key={p.province_id} value={p.province_id} textValue={p.province_name}>{p.province_name}</SelectItem>)}
                    </Select>
                    <Select
                        label="Select Your District"
                        size="sm"
                        radius="sm"
                        classNames={{ listbox: ['text-zinc-900'] }}
                        className={`rounded-md my-2`}
                        color={resultAddress.districts !== "" ? 'success' : 'primary'}
                        onChange={(e) => {
                            const selected = district.find((p: any) => p.district_id === e.target.value);
                            setIdDistrict(selected.district_id)
                            setResultAddress((data) => ({ ...data, districts: selected.district_name }))
                        }}>

                        {district !== null && district.map((p: any) => <SelectItem key={p.district_id} value={p.district_id} textValue={p.district_name}>{p.district_name}</SelectItem>)}
                    </Select>
                    <Select
                        label="Select Your Wards"
                        size="sm"
                        radius="sm"
                        classNames={{ listbox: ['text-zinc-900'] }}
                        className={`rounded-md my-2`}
                        color={resultAddress.wards !== "" ? 'success' : 'primary'}
                        onChange={(e) => {
                            const selected = ward.find((p: any) => p.ward_id === e.target.value);
                            setResultAddress((data) => ({ ...data, wards: selected.ward_name }))
                        }}>

                        {ward !== null && ward.map((p: any) => <SelectItem key={p.ward_id} value={p.ward_id} textValue={p.ward_name}>{p.ward_name}</SelectItem>)}
                    </Select>
                    <input defaultValue={resultAddress.details} className={`w-[99%] h-[15%] min-h-[40px] border border-solid rounded-lg outline-none px-2 my-2 
                    ${resultAddress.details.length !== 0 ? 'border-green-500' : 'border-zinc-400 '}`} type="text"
                        onChange={(e) => { setResultAddress((data) => ({ ...data, details: e.target.value })) }} placeholder="Address detail" />
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="light" onPress={() => { __onClose() }}>
                    Close
                </Button>
                <Button color="success" className="text-white font-bold" onClick={() => submitData(__onClose)}>Update</Button>
            </ModalFooter>
        </>}
    </ModalContent>
}

export default ModalEditAddress
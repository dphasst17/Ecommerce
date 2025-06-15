import { Button, DatePicker, Input, ModalBody, ModalContent, ModalFooter, Select, SelectItem } from "@nextui-org/react";
import fileUpload from "../../../assets/fileUpload.png"
import { StateContext } from "../../../context/state";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { productStore } from "../../../store/product";
import { uploadImageProductToS3 } from "../../../api/image";
import { createProduct } from "../../../api/product";
import { GetToken } from "../../../utils/token";
import { toast } from "react-toastify";
interface KeyDetailType {
    id: string,
    name: string,
    type: string,
    datatypes: "text" | "number",
    displayorder: number,
    displayname: string,

}

const AddProduct = ({ setModalName }: { setModalName: React.Dispatch<React.SetStateAction<string>> }) => {
    const { isDark } = useContext(StateContext)
    const { category } = productStore()
    const { register: registerProduct, handleSubmit, formState: { errors: err } } = useForm();
    const [date, setDate] = useState<string | null>(null)
    const [selectValue, setSelectValue] = useState<string | null>(null);
    const [detail, setDetail] = useState<any[] | null>(null)
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState("")
    const [subImages, setSubImages] = useState<File[]>([])
    useEffect(() => {
        selectValue && category && setDetail(category?.filter((f: any) => f.idType === Number(selectValue))[0].detail)
    }, [selectValue, category])
    const handleSelectChange = (e: any) => {
        setSelectValue(e.target.value)
    }
    const handleChange = (event: any) => {
        const file = event.target.files[0];
        setFile(file)
        setFileName(file.name);
    };
    const handleChangeSubImages = (e: any) => {
        setSubImages(Array.from(e.target.files))
    }
    const onSubmit = async (data: any) => {
        const subImage = new FormData()
        const defaultImage = new FormData()
        for (let i = 0; i < subImages.length; i++) {
            subImage.append(`file${[i]}`, subImages[i])
        }
        file && defaultImage.append("file", file)
        uploadImageProductToS3(subImage)
            .then((res) => {
                console.log(res)
            })
            .catch((err: any) => console.log(err))
        uploadImageProductToS3(defaultImage)
            .then((res) => {
                console.log(res)
            })
            .catch((err: any) => console.log(err))
        const dataInsert = {
            product: [
                {
                    nameProduct: data.nameProduct,
                    price: Number(data.price),
                    brand: data.brand,
                    des: data.des ? data.des : "",
                    idType: Number(selectValue),
                    imgProduct: `${import.meta.env.VITE_REACT_APP_URL_IMG}/product/${fileName}`,
                    dateAdded: date,
                    status: "show",
                    view: 0
                }
            ],
            detail: [detail && detail?.reduce((acc, key) => {
                if (data[key.name] !== undefined) {
                    acc[key.name] = key.datatypes === "text" ? data[key.name] : Number(data[key.name]);
                }
                return acc;
            }, {})],
            tableName: category?.filter((f: any) => f.idType === Number(selectValue))[0].nameType,
            images: subImages && subImages.map((m: any) => ({ img: `${import.meta.env.VITE_REACT_APP_URL_IMG}/product/${m.name}`, type: "extra" }))

        }
        const token = await GetToken()
        token && createProduct(dataInsert, token)
            .then((res: any) => {
                res.status === 201 ? toast.success(res.message) : toast.error(res.message)
                setModalName("")
            })
            .catch((err: any) => console.log(err))
    }
    return <ModalContent>
        {(onClose) => (
            <>
                <ModalBody key="Modal-add-product"
                    className={`w-full h-screen overflow-y-auto ${isDark ? "text-zinc-50" : "text-zinc-950"}`}>
                    <div className="container mx-auto px-4">
                        <form className="w-full h-auto">
                            <div className="formProduct w-full h-full min-h-[400px] flex flex-wrap justify-between px-5">
                                <input
                                    className={`w-[68%] h-[50px] my-2 outline-none rounded-[5px] 
                            border-solid border-[2px] ${err.nameProduct ? 'border-red-500' : 'border-transparent'} px-1`}
                                    type="text"
                                    {...registerProduct("nameProduct", { required: "This is not required" })}
                                    placeholder="Name product"
                                />
                                <input className={`w-[15%] h-[50px] my-2 outline-none rounded-[5px] border-solid border-[2px] ${err.price ? 'border-red-500' : 'border-transparent'} px-1`}
                                    type="number"{...registerProduct("price", { required: true, pattern: /^[0-9]+$/ })} placeholder="Price" />
                                <input className={`w-[15%] h-[50px] my-2 outline-none rounded-[5px] border-solid border-[2px] ${err.price ? 'border-red-500' : 'border-transparent'} px-1`}
                                    type="number"{...registerProduct("total", { required: true, pattern: /^[0-9]+$/ })} placeholder="Total" />
                                <div className="flex items-center justify-around w-full">
                                    <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-[49%] h-40 border-2 ${err.image ? 'border-red-500' : 'border-gray-300'}
                                    border-dashed rounded-lg cursor-pointer bg-gray-700 `}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <img className="w-10 h-10" src={fileUpload} alt="img File upload" />
                                            {fileName && <span className="text-sm text-gray-500 dark:text-white my-2">{fileName}</span>}
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Default image</span></p>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" {...registerProduct("image", { required: true })} onChange={handleChange} />
                                    </label>
                                    <label htmlFor="dropzone-file-sub" className={`flex flex-col items-center justify-center w-[49%] h-40 border-2 ${err.subImage ? 'border-red-500' : 'border-gray-300'}
                                    border-dashed rounded-lg cursor-pointer bg-gray-700 `}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <img className="w-10 h-10" src={fileUpload} alt="img File upload" />
                                            {subImages.length !== 0 && <span className="text-sm text-gray-500 dark:text-white my-2">{subImages?.flatMap((f: any) => f.name).toString()}</span>}
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Sub image</span></p>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file-sub" type="file" className="hidden" multiple
                                            {...registerProduct("subImage", { required: true })} onChange={handleChangeSubImages} />
                                    </label>
                                </div>

                                <DatePicker
                                    label="Date Added"
                                    onChange={(e: any) => { const date = new Date(e).toISOString().split("T")[0]; setDate(date) }}
                                    radius="sm"
                                    className={`w-[32%] h-[50px] my-2 outline-none rounded-[5px] border-solid border-[2px] ${err.dateAdded ? 'border-red-500' : 'border-transparent'} px-1`}
                                />
                                {category && <Select items={category}
                                    classNames={{ trigger: "h-[50px]" }}
                                    placeholder="Select type product"
                                    className={`w-[32%] h-[50px] my-2 outline-none rounded-[5px] border-solid border-[2px] ${err.type ? 'border-red-500' : 'border-transparent'} px-1`}
                                    onChange={handleSelectChange}>
                                    {category.map((e: any) => <SelectItem key={e.idType}>{e.nameType.toUpperCase()}</SelectItem>)}
                                </Select>}
                                <input className={`w-[32%] h-[50px] my-2 outline-none rounded-[5px] border-solid border-[2px] ${err.brand ? 'border-red-500' : 'border-transparent'} px-1`}
                                    type="text" {...registerProduct("brand", { required: true })} placeholder="Brand Product" />
                            </div>
                            <div className="w-full h-auto flex flex-wrap justify-start">
                                {detail && detail.map((d: KeyDetailType) => <Input radius="sm" className={`w-[95%] sm:w-[49%] my-1 p-1 
                                ${err[d.name] ? ' border-solid border-[2px] border-red-500' : ''}`}
                                    {...registerProduct(`${d.name}`, { required: true })}
                                    placeholder={d.displayname.toLocaleUpperCase()} />)}
                            </div>
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleSubmit(onSubmit)()}>Create Product</Button>
                    <Button color="danger" variant="light" onPress={() => { setModalName && setModalName(""); onClose() }}>
                        Close
                    </Button>
                </ModalFooter>
            </>
        )}
    </ModalContent>
}

export default AddProduct
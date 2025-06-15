import { Button, ModalBody, ModalContent, ModalFooter } from "@nextui-org/react";
import { StateContext } from "../../../context/state";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { productStore } from "../../../store/product";
import { createCategory } from "../../../api/product";
import { GetToken } from "../../../utils/token";
import { FaRegTrashAlt } from "react-icons/fa";
import { PiColumnsPlusLeft } from "react-icons/pi";
import { toast } from "react-toastify"
interface KeyDetailType {
    id: string,
    name: string,
    type: string,
    datatypes: "text" | "number" | "longtext",
    displayorder: number,
    displayname: string,
}

const AddCategory = ({ setModalName }: { setModalName: React.Dispatch<React.SetStateAction<string>> }) => {
    const { isDark } = useContext(StateContext)
    const { category, setCategory } = productStore()
    const { register, handleSubmit, watch, formState: { errors: err } } = useForm();
    const [inputs, setInputs] = useState([1, 2, 3]);
    const handleAddCol = () => {
        setInputs([...inputs, inputs.length + 1]);
    };
    const delCol = (index: number) => {
        setInputs(inputs.filter(e => e !== Number(index)))
    }
    const onSubmit = async (data: any) => {
        const arrayObj = inputs.map((value, index: number) => ({
            name: data[`name-${value}`],
            datatypes: data[`option${value}`],
            limit: data[`option${value}`] === 'varchar' ? Number(data[`limit-${value}`]) : 0,
            displayorder: index + 1,
            displayname: data[`displayname-${value}`]
        }));
        const dataInsert = {
            nameType: data.tbName.toLowerCase(),
            table: arrayObj
        }
        const token = await GetToken()
        token && createCategory(dataInsert, token).then((res) => {
            if (res.status === 201) {
                const newData = {
                    idType: res.data.id,
                    nameType: data.tbName.toLowerCase(),
                    detail: arrayObj.map((d: any): KeyDetailType => ({
                        id: `${data.tbName.toLowerCase()}${d.name}`,
                        type: data.tbName.toLowerCase(),
                        name: d.name,
                        datatypes: d.datatypes,
                        displayorder: Number(d.displayorder),
                        displayname: d.displayname
                    }))
                }
                category && setCategory([...category, newData])
                toast.success(res.message)
                setModalName('')
            } else {
                toast.error(res.message)
            }
        }).catch((err) => console.log(err))
    }
    return <ModalContent>
        {(onClose) => (
            <>
                <ModalBody key="Modal-add-category"
                    className={`w-full h-screen overflow-y-auto ${isDark ? "text-zinc-50" : "text-zinc-950"}`}>
                    <div className="container mx-auto px-4">
                        <Button className="w-[150px] h-[30px] rounded-lg bg-green-500 mx-2 font-bold text-white hover:bg-green-400 transition-all"
                            isIconOnly onClick={handleAddCol}>
                            <PiColumnsPlusLeft className="text-[25px]" /> Add Column
                        </Button>
                        <form className="w-full h-auto overflow-y-auto flex flex-wrap justify-center">
                            <input type="text" {...register('tbName', { required: true })} className={`w-3/4 h-[40px] my-4 bg-zinc-800 text-white ${err.tbName ? 'border-solid border-red-500 border-[1px]' : 'border-white border-solid border-[1px]'} rounded-lg outline-none px-2`} placeholder="Name type..." />
                            <div className="formProduct w-[98%] h-auto min-h-[50px] flex flex-wrap justify-center items-start px-5">
                                {inputs.map((input) => {
                                    const watchOption = watch(`option${input}`, '');
                                    return (
                                        <div className="w-full h-auto lg:h-[40px] flex flex-wrap justify-around my-4" key={input}>
                                            <input
                                                className={`w-[45%] lg:w-[15%] h-[40px] lg:h-full bg-zinc-800 text-white ${err[`name-${input}`] ? 'border-solid border-red-500 border-[1px]' : 'border-transparent'} my-2 rounded-lg outline-none px-2`}

                                                {...register(`name-${input}`, { required: true })}
                                                placeholder="Name"

                                            />
                                            <select className="w-[45%] lg:w-[15%] h-[40px] lg:h-full my-2 rounded-lg" {...register(`option${input}`, { required: false })}>
                                                <option value="varchar">Text</option>
                                                <option value="integer">Number</option>
                                                <option value="date">Date</option>
                                            </select>
                                            <input
                                                className={`w-[45%] lg:w-[15%] h-[40px] bg-zinc-800 text-white ${err[`input-demo${input}`] ? 'border-solid border-red-500 border-[1px]' : 'border-transparent'} lg:h-full my-2 rounded-lg outline-none px-2`}

                                                {...register(`limit-${input}`, { required: watchOption === 'longtext' || watchOption === 'date' ? false : true })}
                                                placeholder="Character limit..."
                                                disabled={watchOption === 'longtext' || watchOption === 'date'}
                                            />
                                            <input
                                                className={`w-[45%] lg:w-[15%] h-[40px] bg-zinc-800 text-white ${err[`displayname${input}`] ? 'border-solid border-red-500 border-[1px]' : 'border-transparent'} lg:h-full my-2 rounded-lg outline-none px-2`}

                                                {...register(`displayname-${input}`, { required: true })}
                                                placeholder="Display name"
                                            />
                                            {/* <input
                                                className={`w-[45%] lg:w-[15%] h-[40px] lg:h-full bg-zinc-800 text-white ${err[`order-${input}`] ? 'border-solid border-red-500 border-[1px]' : 'border-transparent'} my-2 rounded-lg outline-none px-2`}

                                                {...register(`order-${input}`, { required: true })}
                                                placeholder="Display order"

                                            /> */}
                                            <Button isIconOnly size="sm" onClick={(e) => { e.preventDefault(); delCol(input) }}
                                                className="h-[40px] lg:h-full my-2 bg-red-600 text-white font-bold rounded-lg">
                                                <FaRegTrashAlt className="text-[20px]" />
                                            </Button>
                                        </div>
                                    )
                                })}

                            </div>
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleSubmit(onSubmit)()}>Create Category</Button>
                    <Button color="danger" variant="light" onPress={() => { setModalName && setModalName(""); onClose() }}>
                        Close
                    </Button>
                </ModalFooter>
            </>
        )}
    </ModalContent>
}

export default AddCategory
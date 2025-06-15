import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StateContext } from "../../context/state";
import { GetToken } from "../../utils/token";
import { createEvent } from "../../api/product";
import { CiTrash } from "react-icons/ci";
import Select from "react-select";
import { toast } from "react-toastify";
import { useFetchData } from "../../hooks/useFetchData";

const FormAddEvent = ({ props }: { props: any }) => {
    const { sale, setSale } = useContext(StateContext)
    const { data } = useFetchData('product', 'eventProductGetAll')
    const [dataSale, setDataSale] = useState<any>([1]);
    const { register, handleSubmit, control } = useForm();
    const [newData, setNewData] = useState<any>(null)
    useEffect(() => {
        data !== null && setNewData(data.data.map((e: any) => { return { value: e.idProduct, label: e.nameProduct, isDis: false } }))
    }, [data])
    const handleChange = (data: any) => {
        setNewData(newData?.map((e: any) => {
            return {
                ...e,
                isDis: data.map((d: any) => d.value).includes(e.value) ? !e.isDis : e.isDis
            }
        }))
    }
    const onSubmit = async (data: any) => {
        const detail = dataSale.flatMap((e: number) => {
            return data[`select${e}`].flatMap((p: any) => ({ discount: Number(data[`percent-${e}`]), idProduct: p.value }))
        })
        const result = {
            sale: {
                title: data.title,
                start_date: data.start,
                end_date: data.end,
            },
            detail: detail
        }
        const token = await GetToken()
        createEvent(result, token).then((res: any) => {
            if (res.status === 201) {
                toast.success(res.message)
                const lastData = {
                    idSale: res.data.id,
                    title: data.title,
                    start_date: data.start.split('-').reverse().join("/"),
                    end_date: data.end.split('-').reverse().join("/")
                }
                setSale([...sale, lastData])
                props.setAddForm(false)
            } else {
                toast.error(res.message)
            }
        })
    }
    return <div className="t-detailItem w-full h-auto flex flex-wrap items-center justify-start my-4">
        <div className="tbHead w-full h-[30px] flex flex-wrap justify-around bg-zinc-100 border-l border-r border-t border-black border-solid">
            <div className="tbBody w-1/5 h-full flex items-center justify-center border-r bg-zinc-100 border-black border-solid text-black font-semibold">Title</div>
            <div className="tbBody w-[15%] h-full flex items-center justify-center border-r bg-zinc-100 border-black border-solid text-black font-semibold">Start date</div>
            <div className="tbBody w-[15%] h-full flex items-center justify-center border-r bg-zinc-100 border-black border-solid text-black font-semibold">End date</div>
            <div className="tbBody w-2/4 h-full flex items-center justify-center bg-zinc-100 border-black border-solid text-black font-semibold">Detail</div>
        </div>
        <div className="tbContent w-full h-auto min-h-[35px] flex flex-wrap items-center justify-around bg-zinc-100 border border-black border-solid">
            <form className="w-2/4 h-auto flex flex-wrap">
                <div className="tbBody w-2/5 h-full flex items-center justify-center border-r bg-zinc-100 border-black border-solid text-black font-semibold">
                    <input {...register(`title`, { required: true })} type="text" className="w-[95%] h-4/5 bg-transparent rounded-lg outline-none" placeholder="Title" />
                </div>
                <div className="tbBody w-[30%] h-full flex items-center justify-center border-r bg-zinc-10 border-black border-solid text-white font-semibold">
                    <input type="date" {...register(`start`, { required: true })} className="w-[95%] h-4/5  bg-zinc-500 rounded-lg outline-none px-1" />
                </div>
                <div className="tbBody w-[30%] h-full flex items-center justify-center border-r bg-zinc-10 border-black border-solid text-white font-semibold">
                    <input {...register(`end`, { required: true })} type="date" className="w-[95%] h-4/5 bg-zinc-500 rounded-lg outline-none px-1" placeholder="Date" />
                </div>
            </form>
            <div className="tbBody w-2/4 h-full flex flex-wrap items-center justify-start bg-zinc-100 px-2 border-black border-solid text-black font-semibold">
                <form className="w-full h-auto flex flex-wrap">
                    {dataSale.map((e: any) => (
                        <div key={e} className="w-[99%] flex items-center mr-4 my-2">
                            #{e} - <input {...register(`percent-${e}`, { required: true, max: 50 })}
                                onChange={(e) => { if (Number(e.target.value) > 50) e.target.value = '50' }} max={50} type="text"
                                className="w-[60px] h-[30px] flex justify-center items-center rounded-lg bg-transparent border-solid border-slate-300 border outline-none mx-2 px-2"
                                placeholder="%" />
                            {'=>'}
                            <Controller
                                name={`select${e}`}
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className="w-4/5 rounded-lg bg-transparent text-black border-slate-400 border-solid border outline-none mx-2"
                                        options={newData?.filter((f: any) => f.isDis === false)}
                                        isMulti
                                        onChange={(change: any) => {
                                            field.onChange(change)
                                            handleChange(change)
                                        }}
                                    />
                                )}
                            />
                            <div onClick={() => setDataSale(dataSale.filter((f: any) => f !== e))} className="w-[25px] h-[25px] flex items-center justify-center rounded-lg bg-red-500 cursor-pointer">
                                <CiTrash />
                            </div>
                        </div>
                    ))}
                </form>
                <div className="w-full h-[30px] flex items-center justify-center">
                    <button onClick={() => { setDataSale([...dataSale, dataSale.length + 1]) }} className="w-[150px] bg-green-500 rounded-lg">Add more</button>
                </div>
            </div>
        </div>
        <button onClick={() => { handleSubmit(onSubmit)() }} className="w-[150px] h-[30px] bg-green-500 rounded-lg my-8 text-white font-bold">Add event</button>
        <button onClick={() => { props.setAddForm(false) }} className="w-[150px] h-[30px] bg-red-500 rounded-lg my-8 text-white font-bold mx-2">Close</button>
    </div>
}
export default FormAddEvent
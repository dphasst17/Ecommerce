import { useContext, useState } from "react"
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { StateContext } from "../../context/state";
import { formatDate } from "../../utils/utils";
import { GetToken } from "../../utils/token";
import { deleteEvent, updateEvent } from "../../api/product";
import { Modal, useDisclosure } from "@nextui-org/react";
import DetailEvent from "./detail";
import FormAddEvent from "./addEvent";
import { toast } from "react-toastify";

const Event = () => {
  const { isDark, sale, setSale } = useContext(StateContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [idEdit, setIdEdit] = useState(0);
  const [formValue, setFormValue] = useState<any>({ title: '', start_date: '', end_date: '' })
  const [addForm, setAddForm] = useState(false);
  const [idDetail, setIdDetail] = useState(0)
  const editEventSale = async () => {
    const resultObj = sale.filter((f: any) => f.idSale === idEdit).map((s: any) => ({
      title: s.title,
      start_date: s.start_date.split("T")[0],
      end_date: s.end_date.split("T")[0]
    }))
    const keyChange = Object.keys(formValue).filter((e: any) => formValue[e] !== "").filter((f: any) => formValue[f] !== resultObj[0][f])


    if (keyChange.length === 0) {
      setIdEdit(0)
      setFormValue({ title: '', start_date: '', end_date: '' })
      return
    }
    const keyUpdate = keyChange.reduce((acc, key) => {
      return { ...acc, [key]: formValue[key] };
    }, {});
    const dataUpdate = {
      idSale: idEdit,
      sale: [keyUpdate]
    }
    const token = await GetToken()
    updateEvent(dataUpdate, token).then(res => {
      if (res.status === 200) {
        const currentData = sale
        setSale(currentData.map((e: any) => {
          return e.idSale === idEdit ? { ...e, ...keyUpdate } : { ...e }
        }
        ))
        setIdEdit(0)
        setFormValue({ title: '', startDate: '', endDate: '' })
        toast.success("Update Event is success")
      } else {
        toast.error("Update Event is failed")
      }

    })
  }
  const delEvent = async (idSale: number) => {
    const token = await GetToken()
    deleteEvent(idSale, token).then(res => {
      if (res.status === 200) {
        setSale(sale.filter((f: any) => f.idSale !== idSale))
      }
      alert(res.message)
    })
  }
  return <div className={`event-detail relative w-full h-auto min-h-[95.5vh] flex flex-wrap justify-center content-start lg:justify-between ${isDark ? "bg-[#1F1F1F]" : "bg-[#F5F5F5]"} px-8`}>
    <h1 className={`w-full h-[30px] text-[30px] font-bold ${isDark ? "text-white" : "text-black"} text-center my-8`}>Event management</h1>
    <button onClick={() => { setAddForm(!addForm) }} className="w-[150px] h-[30px] bg-blue-500 rounded-lg my-8 text-white font-bold">+ Create event</button>

    <div className={`tbHead w-full h-[30px] flex flex-wrap justify-around p-2 my-2 rounded-md border boder-solid ${isDark ? "text-white border-zinc-200" : "text-black border-zinc-400"}`}>
      <div className="tbBody w-[15%] h-full flex items-center justify-center  text-[20px] font-semibold">Id sale event</div>
      <div className="tbBody w-2/5 h-full flex items-center justify-center  text-[20px] font-semibold">Title</div>
      <div className="tbBody w-[15%] h-full flex items-center justify-center  text-[20px] font-semibold">Start date</div>
      <div className="tbBody w-[15%] h-full flex items-center justify-center  text-[20px] font-semibold">End date</div>
      <div className="tbBody w-[15%] h-full flex items-center justify-center font-semibold">Action</div>
    </div>
    {sale !== null && sale.map((s: any) => <div className={`tbHead w-full h-[50px] flex flex-wrap justify-around border border-solid
      ${isDark ? "text-white border-zinc-100" : "text-black border-zinc-400"} rounded-md py-1`}>
      <div className="tbBody w-[15%] h-full flex items-center justify-center font-semibold">{s.idSale}</div>
      <div className="tbBody w-2/5 h-full flex items-center justify-center font-semibold">
        {idEdit === s.idSale ? <input type="text" className="w-4/5 h-[90%] border-slate-500 rounded-lg px-2 border-solid border bg-transparent outline-none"
          onChange={(e) => { setFormValue({ ...formValue, title: e.target.value ? e.target.value : s.title }) }}
          placeholder={s.title} /> : s.title}
      </div>
      <div className="tbBody w-[15%] h-full flex items-center justify-center font-semibold">
        {formatDate(s.start_date)}
      </div>
      <div className="tbBody w-[15%] h-full flex items-center justify-center font-semibold">
        {idEdit === s.idSale ? <input type="date" className="w-4/5 h-[90%] border-slate-500 rounded-lg px-2 border-solid border bg-transparent outline-none"
          onChange={(e) => { setFormValue({ ...formValue, end_date: e.target.value ? e.target.value : formatDate(s.end_date) }) }}
          placeholder={formatDate(s.end_date)} /> : formatDate(s.end_date)}</div>
      <div className="tbBody w-[15%] h-full flex items-center justify-evenly font-semibold">
        {idEdit !== s.idSale && <button onClick={() => { setIdDetail(s.idSale); onOpen() }} className="w-[50px] h-[20px] rounded-lg flex justify-center items-center">
          <FaEye />
        </button>}
        {idEdit !== s.idSale && <button onClick={() => { setIdEdit(s.idSale) }} className="w-[50px] h-[20px] rounded-lg flex justify-center items-center">
          <FaEdit />
        </button>}
        {idEdit !== s.idSale && <button onClick={() => { delEvent(s.idSale) }} className="w-[50px] h-[20px] rounded-lg flex justify-center items-center bg-transparent">
          <FaTrash />
        </button>}
        {idEdit === s.idSale && <button onClick={() => { editEventSale() }} className="w-[50px] h-[20px] rounded-lg flex justify-center items-center bg-green-500 ">Save</button>}
        {idEdit === s.idSale && <button onClick={() => { setIdEdit(0); setFormValue({ title: '', start_date: '', end_date: '' }) }} className="w-[50px] h-[20px] rounded-lg flex justify-center items-center bg-red-500 ">Close</button>}
      </div>
    </div>)}
    {addForm && <FormAddEvent props={{ setAddForm }} />}
    <Modal
      size="5xl"
      isOpen={isOpen} onOpenChange={onOpenChange}>
      <DetailEvent idSale={idDetail} />
    </Modal>
  </div>
}

export default Event

import { userStore } from "../../store/user"
import { StaffType } from "../../types/types"
import { Avatar, Badge, Button, DatePicker, Input, ModalBody, ModalContent } from "@nextui-org/react"
import { DateValue, parseAbsoluteToLocal } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GetToken } from "../../utils/token";
import { updateInfo } from "../../api/user";
interface FormValue {
  name: string
  email: string
  phone: string
  address: string
}
const CurrentUser = () => {
  const { currentUser, setCurrentUser } = userStore()
  const { register, handleSubmit } = useForm()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [birthDay, setBirthDay] = useState<DateValue | any>(parseAbsoluteToLocal((currentUser ? new Date(currentUser[0].birthday!) : new Date()).toISOString()))
  const onSubmit = async (data: any) => {
    const filterData = (Object.keys(data) as (keyof FormValue)[]).filter((k: keyof FormValue) => currentUser && currentUser[0][k] !== data[k])
    const changeBirthDay = currentUser && currentUser[0].birthday !== birthDay.toString().split("T")[0]
    let dataUpdate = filterData.reduce((acc, key) => {
      return { ...acc, [key]: data[key] };
    }, {})
    dataUpdate = changeBirthDay ? { ...dataUpdate, birthday: birthDay.toString().split("T")[0] } : dataUpdate
    const token = await GetToken()
    token && filterData.length !== 0 && updateInfo(token, { table: "staff", detail: [dataUpdate] })
      .then(res => {
        alert(res.message)
        setIsEdit(false)
        currentUser && setCurrentUser(currentUser.map((c: StaffType) => ({ ...c, ...dataUpdate })))
      })
      .catch(err => console.log(err))

  }
  return <ModalContent>
    {(onClose) =>
      <>
        <ModalBody>
          <div className="info-user w-full h-auto pt-1">
            {currentUser && currentUser.map((c: StaffType) => <div className="w-full h-auto flex flex-wrap justify-around items-center" key={`current-user-${c.idStaff}`}>
              <Badge size="lg" classNames={{ badge: "flex justify-center items-center w-7 h-6 rounded-md cursor-pointer" }} content={<FaRegEdit />} color="primary" placement="bottom-right">
                <Avatar src={c.avatar} size="lg" radius="sm" color="primary" />
              </Badge>
              <Input {...register('name', { required: true })} isReadOnly={!isEdit} radius="sm" className="w-[98%] mb-1 mt-4" type="text" defaultValue={c.name} placeholder="Name" />
              <Input {...register('email', { required: true })} isReadOnly={!isEdit} radius="sm" className="w-[48%] my-1" type="text" defaultValue={c.email} placeholder="Email" />
              <Input {...register('phone', { required: true })} isReadOnly={!isEdit} radius="sm" className="w-[48%] my-1" type="text" defaultValue={c.phone} placeholder="Phone" />
              <Input {...register('address', { required: true })} isReadOnly={!isEdit} radius="sm" className="w-[98%] my-2" type="text" defaultValue={c.address} placeholder="Address" />
              <I18nProvider locale="en-GB">
                <DatePicker
                  isReadOnly={!isEdit}
                  granularity="day"
                  className="w-[98%]"
                  radius="sm"
                  onChange={setBirthDay}
                  aria-label="DatePicker"
                  value={birthDay}
                />
              </I18nProvider>
              {!isEdit && <Button onClick={() => setIsEdit(!isEdit)} color="primary" size="sm" className="my-1" radius="sm">
                <IoSettingsOutline className="text-[20px] text-zinc-50" />
                Edit
              </Button>}
              {isEdit &&
                <div className="flex justify-around items-center">
                  <Button onClick={handleSubmit(onSubmit)} color="success" size="sm" className="m-1 text-white" radius="sm">
                    Update
                  </Button>

                </div>
              }
              <Button onClick={() => { setIsEdit(false); onClose() }} color="danger" size="sm" className="m-1 text-white" radius="sm">
                Cancel
              </Button>
            </div>
            )}
          </div>
        </ModalBody>
      </>
    }
  </ModalContent>
}

export default CurrentUser
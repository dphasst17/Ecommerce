import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { GetToken } from "../../../utils/token";
import { Modals, UserUpdateType } from "../../../types/type";
import { updateUser } from "../../../api/user";
import { userStore } from "../../../store/user";

interface FormValue {
  nameUser: string,
  phone: string,
  email: string,
}
const ModalEdit = ({ setModalName }: Modals) => {
  const { user, updated_Store_User } = userStore()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValue>()
  const onSubmit = async (data: FormValue) => {
    const changedKeys = (Object.keys(data) as (keyof FormValue)[]).filter((key: keyof FormValue) => {
      const userKey = key;
      return user && user[0][userKey] !== data[key];
    });
    const token = await GetToken()
    const detailData = changedKeys.reduce((acc, key) => {
      return { ...acc, [key]: data[key] };
    }, {});
    const dataUpdate: UserUpdateType = {
      table: "users",
      detail: [detailData]
    }
    token && changedKeys.length !== 0 && updateUser(token, dataUpdate)
      .then(res => {
        if (res.status === 200) {
          updated_Store_User(dataUpdate.detail[0])
        }
        alert(res.message)
      })

  }
  return <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
        <ModalBody>
          <form className="w-full">
            <Input {...register('nameUser', { required: true })} type="text" label="Name" className="w-full my-2" radius="sm" defaultValue={user ? user[0].nameUser : ""} />
            <Input {...register('phone', { required: true })} type="text" label="Phone" className="w-full my-2" radius="sm" defaultValue={user ? user[0].phone : ""} />
            <Input {...register('email', {
              required: true, pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address"
              }
            })} type="text" label="Email" className="w-full my-2" radius="sm" defaultValue={user ? user[0].email : ""} />
            {errors.email && <p>{errors.email.message}</p>}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={() => { setModalName && setModalName(""); onClose() }}>
            Close
          </Button>
          <Button onClick={() => { handleSubmit(onSubmit)() }} color="success" className="text-white font-bold">Update</Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>

}

export default ModalEdit
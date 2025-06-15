import { authUpdatePassword } from '../../api/auth'
import { useForm } from 'react-hook-form'
import { GetToken } from '../../utils/token'
import { Button, Input } from '@nextui-org/react'
import { toast } from "react-toastify"
interface FormValue {
  current: string,
  new: string,
  confirm: string
}
const Password = () => {
  const { register, handleSubmit } = useForm<FormValue>()
  const onSubmit = async (data: FormValue) => {
    console.log(data)
    if (data.confirm !== data.new) {
      toast.error("Confirm password does not match with password!")
      return
    }
    const dataUpdate = {
      current: data.current,
      password: data.new
    }
    const token = await GetToken()
    token && authUpdatePassword(token, dataUpdate)
      .then(res => {
        res.status === 200 ? toast.success(res.message) : toast.error(res.message)
      })
  }
  return <div className='password w-full h-[500px] flex flex-col justify-center items-center my-auto'>
    <form className="w-2/4">
      <Input {...register('current', { required: true })} type="text" label="Current password" className="w-full my-2" radius="sm" />
      <Input {...register('new', { required: true })} type="text" label="New password" className="w-full my-2" radius="sm" />
      <Input {...register('confirm', { required: true })} type="text" label="Confirm password" className="w-full my-2" radius="sm" />
    </form>
    <Button radius="sm" onClick={() => { handleSubmit(onSubmit)() }} color="success" className="w-[150px] bg-[#242424] text-white font-bold">Update</Button>
  </div>
}

export default Password
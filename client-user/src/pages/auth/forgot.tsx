import { Button, Input, Tooltip } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { Auth } from "../../types/type"

const Forgot = ({ handleAuth, setFormName }: { handleAuth: any, setFormName: React.Dispatch<React.SetStateAction<string>> }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Auth>()
  const onSubmit = (data: Auth) => {
    const dataForgot = {
      username: data.username,
      mail: data.email
    }
    handleAuth('forgot', dataForgot)
  }
  return <div className='formSignIn w-[99%] lg:w-4/5 h-4/5 flex flex-col justify-center items-center'>
    <h1 className="text-zinc-700 text-[30px] font-bold font-ps-2 my-6">FORGOT PASSWORD</h1>
    <form className="w-full sm:w-4/5 lg:w-3/5">
      <Input {...register('username', { required: true })} radius="sm" variant="bordered" className="my-2 text-zinc-900 border-zinc-500" label="Username" type="text" />
      <Input {...register('email', {
        required: true, pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address"
        }
      })} radius="sm" variant="bordered" className="my-2 text-zinc-900 border-zinc-500" label="Email" type="text"
        onKeyDown={(e: any) => { e.key === "Enter" && handleSubmit(onSubmit)() }}
      />
      {errors?.email && <Tooltip content={errors.email.message}></Tooltip>}
    </form>
    <Button color="primary" size="sm" radius="sm" onClick={() => { handleSubmit(onSubmit)() }}>Reset Password</Button>
    <p className="text-sm font-light text-gray-500 dark:text-gray-400 my-2">
      Already have an account? <a href="#" onClick={() => { setFormName('signIn') }} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
    </p>
  </div>
}

export default Forgot
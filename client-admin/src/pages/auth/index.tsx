import { Input } from "@nextui-org/react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../api/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SetToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../../context/state";
interface FieldValues {
  username: string
  password: string
}

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>();
  const { isDark, setIsLogin, setRole } = useContext(StateContext)
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const onSubmit = (data: FieldValues) => {
    login(data)
      .then(res => {
        if (res.status !== 200) {
          toast.error(res.message)
        } else {
          SetToken('aTk', res.data.accessToken, res.data.expiredA)
          SetToken('rTk', res.data.refreshToken, res.data.expiredR)
          SetToken('role', res.data.role, res.data.expiredR)
          SetToken('a-Log', 'true', res.data.expiredR)
          setIsLogin(true)
          setRole(res.data.role)
          navigate(res.data.router)
        }
      })
  }

  return <div className="bg-white dark:bg-gray-900">
    <div className="flex justify-center h-screen">
      <div className="hidden bg-cover lg:block lg:w-2/3" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)" }}>
        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
        </div>
      </div>

      <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div className="flex-1">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">ADMIN</h2>

            <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <Input {...register('username', { required: true })} className={`${isDark ? "text-white" : "text-black"}`} variant="bordered" type="text" label="Username" placeholder="Enter your username" />
                {errors.username && <p className="text-red-500">This field is required</p>}
              </div>

              <div className="mt-6">
                <Input
                  {...register('password', { required: true })} className={`${isDark ? "text-white" : "text-black"}`} variant="bordered" type={showPassword ? "text" : "password"}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(onSubmit)()}
                  label="Password" placeholder="Enter your password" />
                {errors.password && <p className="text-red-500">This field is required</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-200">
                    <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2">Show Password</span>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => { handleSubmit(onSubmit)() }}
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
}

export default Auth
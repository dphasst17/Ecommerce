import { useContext, useState } from "react"
import { authForgot, authLogin, authRegister } from "../../api/auth"
import { SaveToken } from "../../utils/token"
import { useNavigate } from "react-router-dom"
import { StateContext } from "../../context/stateContext"
import thumbnail from "../../assets/thumbnails.png"
import SignIn from "./signIn"
import SignUp from "./signUp"
import Forgot from "./forgot"
import LoadingComponent from "../../components/loading/loadingComponent"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const { setIsLogin } = useContext(StateContext)
  const [formName, setFormName] = useState<string>("signIn")
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const handleAuth = (typeAuth: string, data: any) => {
    setLoading(true)
    let url;
    switch (typeAuth) {
      case 'login':
        url = authLogin;
        break;
      case 'register':
        url = authRegister;
        break;
      case 'forgot':
        url = authForgot;
        break;
    }
    url && url(data).then((res: { status: number, message?: string, data?: any }) => {
      setLoading(false)
      if (res.status === 200 || res.status === 201) {
        res.message && toast.success(res.message)
        if (typeAuth === "login") {
          SaveToken('u-aTk', res.data.accessToken, res.data.expiredA)
          SaveToken('u-rTk', res.data.refreshToken, res.data.expiredR)
          setIsLogin(true)
          SaveToken('u-login', 'true', res.data.expiredR)
          navigate('/')
        }
        (typeAuth === "register" || typeAuth === "forgot") && setFormName("signIn")
      }
      else {
        res.message && toast.error(res.message)
      }

    })
  }
  return <div className="auth w-full h-screen flex flex-wrap">
    {loading && <LoadingComponent />}
    <div className="background-auth w-full lg:w-2/5 xl:w-2/4 h-1/5 sm:h-2/5 lg:h-full flex items-center justify-center">
      <img className="w-full xl:w-4/5 h-full xl:h-4/5 object-contain" src={thumbnail} />
    </div>
    <div className="authForm w-full lg:w-3/5 xl:w-2/4 h-4/5 sm:h-3/5 lg:h-full flex items-center justify-center">
      {formName === "signIn" && <SignIn handleAuth={handleAuth} setFormName={setFormName} />}
      {formName === "signUp" && <SignUp handleAuth={handleAuth} setFormName={setFormName} />}
      {formName === "forgot" && <Forgot handleAuth={handleAuth} setFormName={setFormName} />}
    </div>
    <ToastContainer />
  </div>
}

export default Auth
import GithubIcon from "../../components/icon/github"
import FacebookIcon from "../../components/icon/facebook"
import GoogleIcon from "../../components/icon/google"
import { Button, Input } from "@nextui-org/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Auth } from "../../types/type";
import { useGoogleLogin } from "@react-oauth/google"
const SignIn = ({ handleAuth, setFormName }: { handleAuth: any, setFormName: React.Dispatch<React.SetStateAction<string>> }) => {
    const { register, handleSubmit } = useForm<Auth>()
    const [isShow, setIsShow] = useState(false)
    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse =>
            fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`)
                .then(response => response.json())
                .then(data => handleAuth('login', { email: data.email }))


    })
    const listSignIn = [
        {
            id: 1,
            name: 'Facebook',
            icon: FacebookIcon,
            handleClick: ""
        },
        {
            id: 2,
            name: 'Google',
            icon: GoogleIcon,
            handleClick: googleLogin

        },
        {
            id: 3,
            name: 'Github',
            icon: GithubIcon,
            handleClick: ""
        }
    ]
    const onSubmit = (data: Auth) => {
        handleAuth('login', { username: data.username, password: data.password })
    }
    return <div className='formSignIn w-[99%] lg:w-4/5 h-4/5 flex flex-col justify-center items-center'>
        <div className="btnLogin w-full flex flex-wrap justify-center items-center">
            {listSignIn.map((b: any) => <Button size="sm" radius="sm" key={b.id}
                className={`w-[150px] mx-1 bg-transparent border border-solid border-zinc-500 my-1`} onClick={b.handleClick}>
                <b.icon />
                <span>{b.name}</span>
            </Button>)}
        </div>
        <h1 className="text-zinc-700 text-[30px] font-bold font-ps-2 my-6">SIGN IN</h1>
        <form className="w-full sm:w-4/5 lg:w-3/5">
            <Input {...register('username', { required: true })} radius="sm" variant="bordered" className="my-2 text-zinc-900 border-zinc-500" label="Username" type="text" />
            <Input {...register('password', { required: true })} radius="sm" variant="bordered" className="my-2 text-zinc-900 border-zinc-500" label="Password"
                type={isShow ? 'text' : 'password'}
                onKeyDown={(e: any) => { e.key === "Enter" && handleSubmit(onSubmit)() }}
            />
        </form>
        <div className="w-full sm:w-3/5 h-[60px] sm:h-[30px] text-blue-500 flex flex-wrap justify-between my-1">
            <button onClick={() => { setIsShow(!isShow) }}>{isShow ? 'Hide' : 'Show'} password</button>
            <button onClick={() => { setFormName("forgot") }}>Forgot password?</button>
        </div>
        <Button color="primary" size="sm" radius="sm" onClick={() => { handleSubmit(onSubmit)() }}>Sign in</Button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400 my-2">
            Don’t have an account yet? <a href="#" onClick={() => { setFormName('signUp') }} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
        </p>
    </div>
}

export default SignIn
import Cookies from "js-cookie"
import { removeLocalStorage } from "./localStorage"
import { authToken } from "../api/auth"
export const GetToken = async () => {
    const access = Cookies.get('aTk')
    const refresh = Cookies.get('rTk')
    if (!access) {
        if (!refresh) {
            removeLocalStorage('isLogs')
            return false
        }
        const response = await authToken(refresh)
        const res = await response.json()
        SetToken('aTk', res.data.accessToken, res.data.expiredA)
        return res.data.accessToken

    }
    return access
}
export const SetToken = (name: string, token: string, exp: number) => {
    return Cookies.set(name, token, {
        expires: new Date(exp * 1000),
        path: "/",
    })
}
export const RemoveToken = (name: string) => {
    return Cookies.remove(name, { path: '/' })
}
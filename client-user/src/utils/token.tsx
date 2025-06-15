import Cookies from "js-cookie"
import { removeLocalStorage } from "./localStorage"
import { authToken } from "../api/auth"
export const GetToken = async () => {
    const access = Cookies.get('u-aTk')
    const refresh = Cookies.get('u-rTk')
    if (!access) {
        if (!refresh) {
            removeLocalStorage('isLogs')
            return false
        }
        const response = await authToken(refresh)
        const res = await response.json()
        SaveToken('u-aTk', res.data.accessToken, res.data.expiredA)
        return res.data.accessToken

    }
    return access
}
export const SaveToken = (name: string, token: string, exp: number) => {
    return Cookies.set(name, token, {
        expires: new Date(exp * 1000),
        path: "/",
    })
}
export const RemoveToken = (name: string) => {
    return Cookies.remove(name, { path: '/' })
}
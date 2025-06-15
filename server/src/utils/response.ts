export const responseMessage = (res: any, status: number, message: string) => {
    res.status(status).json({ status: status, message: message })
}
export const responseData = (res: any, status: number, data: {}[] | [] | any) => {
    res.status(status).json({ status: status, data: data })
}
export const responseMessageData = (res: any, status: number, message: string, data?: {}[] | [] | {} | any) => {
    res.status(status).json({ status: status, message: message, data: data })
}
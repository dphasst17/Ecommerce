export const pagination = (itemsInPage: number, dataLength: number): number => {
    return Math.ceil(dataLength / itemsInPage)
}
export const percentDiscount = (discount: number, price: number) => {
    return price - ((price * discount) / 100)
}
export const formatDate = (date: string): string => {
    return date.split("T")[0].split("-").reverse().join("/")
}
export const formatDateSliceYear = (date: string): string => {
    return date.split("T")[0].split("-").slice(1, 3).reverse().join("/")
}
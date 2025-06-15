import { useEffect } from "react"
import { ProductType } from "types/type"

export const SortedData = (data: ProductType[] | null, 
    filterPrice: string, 
    setData: React.Dispatch<React.SetStateAction<ProductType[] | null>>,
    setActivePage: React.Dispatch<React.SetStateAction<number>>
) => {
    useEffect(() => {
        setActivePage(1)
        if (data) {
            const sortedData = filterPrice !== ""
                ? [...data].sort(
                    (a: any, b: any) => filterPrice === "lth" ? a.price - b.price : b.price - a.price
                )
                : [...data]
            JSON.stringify(sortedData) !== JSON.stringify(data) &&
                setData(sortedData);
        }
    }, [data, filterPrice, setData])
}
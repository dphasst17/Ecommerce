import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useFetchDataByKey } from "../../hooks/useFetchData"
import { useContext } from "react"
import { StateContext } from "../../context/state"
interface EventDetailProductType {
    id: number,
    idSale: number,
    idProduct: number,
    nameProduct: string,
    imgProduct: string,
    price: number,
    discount: number
}
const DetailEvent = ({ idSale }: { idSale: number }) => {
    const { data } = useFetchDataByKey('product', 'getSaleDetail', idSale)
    const { isDark } = useContext(StateContext)
    return <ModalContent>
        {(__onClose) => <>
            <ModalHeader><span className={`${isDark ? "text-zinc-50" : "text-zinc-950"}`}>{data && data.data[0].title}</span></ModalHeader>
            <ModalBody>
                <div className="w-full h-[500px] overflow-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  gap-2">
                    {data && data.data[0].detail.map((p: EventDetailProductType) => <div key={p.id}
                        className="relative h-[100px] grid grid-cols-2 bg-zinc-300 rounded-md">
                        <div className="absolute inset-1 w-[40px] h-[20px] rounded-md bg-red-500 flex items-center justify-center">-{p.discount}%</div>
                        <div className="img w-full h-[100px]">
                            <img className="w-full h-full object-contain" src={p.imgProduct} alt="" />
                        </div>
                        <div className="flex items-center justify-center font-tech-mono text-sm text-zinc-950">{p.nameProduct}</div>

                    </div>)}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onPress={__onClose}>Close</Button>
            </ModalFooter>
        </>}
    </ModalContent>
}

export default DetailEvent
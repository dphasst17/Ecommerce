import { Modal, useDisclosure } from "@nextui-org/react"
import { productStore } from "../../store/product"
import { CategoryProductType } from "../../types/types"
import ModalCateDetail from "./modal/category"
import { useState } from "react"

const Category = () => {
    const { category } = productStore()
    const [name, setName] = useState<string>("")
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    return <div className="w-full h-auto grid grid-cols-1 ssm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 content-center px-3 my-4">
        {/* {category && category.map((c: CategoryProductType) => <div
            onClick={() => {
                setName(c.nameType)
                onOpen()
            }} className="w-[200px] h-[100px] relative hover:scale-110 transition-all" key={c.idType}>
            <div className='h-full flex items-center justify-center'
                style={{
                    background: 'white',
                    clipPath: 'polygon(80% 0%, 0% 0px, 0% 60%, 20% 100%, 100% 100%, 100% 40%)'
                    ,
                }}
            ></div>
            <div className='absolute top-0 left-0 w-full h-full cursor-pointer flex items-center justify-center font-bold font-tech-shark text-[20px] px-3 border border-solid borderr-zinc-50'
                style={{
                    backgroundImage: 'url(https://i.pinimg.com/564x/7e/80/52/7e805269cf7be40bb2ff0fcd61f458a5.jpg)',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    clipPath: 'polygon(79% 1%, 0.5% 1px, 0.5% 59%, 21% 99%, 99% 99%, 99% 41%)'
                }}
            >
                {c.nameType.toLocaleUpperCase()}
            </div>
        </div>)} */}
        {category && category.map((t: CategoryProductType) => <div  onClick={() => {
                setName(t.nameType)
                onOpen()
            }}  className="h-[100px] relative hover:scale-110 transition-all bg-zinc-500 rounded-md" 
            key={t.idType}>
                <div className="absolute w-full h-full z-0">
                    <div className="relative w-full h-full">
                        <img className="w-full h-full object-cover rounded-md" src={t.image_url} alt="Images_url" />
                        <div className="overlay w-full h-full absolute top-0 left-0 flex items-center justify-center bg-zinc-950 bg-opacity-60 rounded-md"></div>
                    </div>
                </div>
                <div className='relative z-10 w-full h-full cursor-pointer truncate flex flex-col items-center justify-center font-bold text-[20px] px-3'
                >
                    <span className="truncate font-tech-shark">{t.nameType}</span>
                    <span>{t.count} items</span>
                </div>
            </div>)}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
            <ModalCateDetail name={name} />
        </Modal>
    </div>
}

export default Category
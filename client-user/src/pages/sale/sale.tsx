import { formatDate, percentDiscount } from '../../utils/utils'
import { StateContext } from '../../context/stateContext'
import { useContext } from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/cartContext'
import Empty_Data from '../../components/error/empty'

const ProductSale = () => {
    const { sale } = useContext(StateContext)
    const { addItemCart } = useContext(CartContext)
    const navigate = useNavigate()
    const navigateDetail = (data: any) => {
        navigate(`/product/detail/${data.nameType}/${data.idProduct}/${data.nameProduct.split(" ").join("-")}`)
    }
    return <div className='w-full h-auto min-h-[50vh] my-auto'>
        {sale && sale.length !== 0 ? sale.map((e: any) => <div className='w-full h-auto min-h-[50vh] flex flex-col justify-center items-center'>
            <h1 className='text-center font-bold font-tech-shark text-4xl text-zinc-950'>{e.title}</h1>
            <div className='text-center font-bold font-tech-mono text-3xl text-zinc-950'>
                {formatDate(e.start_date)} - {formatDate(e.end_date)}
            </div>
            <div className='w-4/5 h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 my-4'>
                {e.detail.map((d: any) => <Card className="h-auto min-h-[150px] rounded-md border border-solid border-transparent hover:border-cyan-500 transition-all"
                >
                    <CardBody className="relative w-full h-auto flex flex-col items-center justify-center cursor-pointer">
                        {d.discount !== 0 && <div className="absolute w-[50px] h-[25px] flex items-center justify-center text-white rounded-md bg-red-500 top-1 left-1">
                            -{d?.discount}%
                        </div>}
                        <div onClick={() => addItemCart(d)} className="absolute w-[50px] h-[25px] flex items-center justify-center text-white rounded-md bg-cyan-500 top-1 right-1">
                            <AiOutlineShoppingCart className="text-[20px]" />
                        </div>
                        <div className="w-3/5 h-[150px] flex items-center justify-center" onClick={() => navigateDetail(d)}>
                            <img className="w-full h-auto object-contain"
                                loading="eager"
                                src={`${d.imgProduct}`} alt={`images-${d?.nameProduct}`} />
                        </div>
                        <div className="product-info flex flex-wrap justify-center overflow-hidden py-1 rounded-lg w-[calc(100%_-_8px)]">
                            <div
                                onClick={() => navigateDetail(d)}
                                className="w-[90%] h-[25px] flex items-center justify-start text-zinc-950 font-bold text-[18px] truncate cursor-pointer"
                            >
                                <span className="truncate">{d?.nameProduct}</span>
                            </div>
                            <div className="w-[90%] h-[25px] flex items-center justify-start text-zinc-950 font-bold text-[18px] truncate">
                                $ {d.discount !== 0
                                    ? <><span className="text-red-600 font-semibold line-through">{d.price}</span> {percentDiscount(d.discount!, Number(d.price))}</>
                                    : d.price}
                            </div>
                            {/* <div className="product-btn w-[90%] flex flex-wrap justify-around">
                        <Button size="sm" className="w-full xl:w-3/4 font-semibold rounded-md bg-[#0a2461] text-zinc-50" onClick={() => addItemCart(data)}>
                            <AiOutlineShoppingCart className="text-[15px]"/>Add to cart
                        </Button>
                    </div> */}

                        </div>
                    </CardBody>
                </Card>)}
            </div>
        </div>)
            : <Empty_Data />
        }
    </div>
}

export default ProductSale
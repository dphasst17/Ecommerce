import { Button, Card, CardBody } from "@nextui-org/react"
import { useContext } from "react"
import { Fade } from "react-awesome-reveal"
import { useNavigate } from "react-router-dom";
import { ProductType } from "types/type";
import { CartContext } from "../../context/cartContext";
import { percentDiscount } from "../../utils/utils";
const Home_Product_Layout = ({ data }: { data: ProductType }) => {
    const { addItemCart } = useContext(CartContext)
    const navigate = useNavigate()
    const navigateDetail = () => {
        navigate(`/product/detail/${data.nameType}/${data.idProduct}/${data.nameProduct.split(" ").join("-")}`)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    
    return <Fade triggerOnce fraction={0.6} className="h-auto overflow-hidden " delay={1}>
        <Card className="w-full h-auto min-h-[150px] rounded-md border border-solid border-zinc-200 hover:border-cyan-500 transition-all shadow-medium">
            <CardBody className="relative w-full h-auto flex flex-col items-center justify-center cursor-pointer">
                {data.discount !== 0 && <div className="absolute w-[50px] h-[25px] flex items-center justify-center text-white rounded-md bg-red-500 top-1 left-1">
                    -{data?.discount}%
                </div>}
                <div className="w-3/5 h-[150px] flex items-center justify-center" onClick={navigateDetail}>
                    <img className="w-full h-full object-contain"
                        loading="eager"
                        src={`${data.imgProduct}`} alt={`images-${data?.nameProduct}`} />
                </div>
                <div className="product-info w-full flex flex-wrap justify-center overflow-hidden py-1 rounded-lg">
                    <div
                        onClick={navigateDetail}
                        className="w-[90%] h-[25px] flex items-center justify-center my-2 py-2 text-zinc-950 font-bold text-[18px] truncate cursor-pointer"
                    >
                        <span className="truncate">{data?.nameProduct}</span>
                    </div>
                    <div className="w-4/5 sm:w-2/4 h-[25px] flex items-center justify-start text-zinc-950 font-bold text-[18px] truncate">
                        $ {data.discount !== 0
                            ? <>
                                <span className="text-red-600 font-semibold line-through">{data.price}</span>
                                &nbsp;{percentDiscount(data.discount!, Number(data.price))}
                            </>
                            : data.price}
                    </div>
                    <Button onClick={() => addItemCart(data)} size="sm" className="w-4/5 sm:w-2/4 bg-zinc-950 text-white font-bold">Add to cart</Button>
                </div>
            </CardBody>
        </Card>
    </Fade>
}

export default Home_Product_Layout

import { Button, Card, CardBody } from "@nextui-org/react"
import { useContext } from "react"
import { Fade } from "react-awesome-reveal"
import { useNavigate } from "react-router-dom";
import { ProductType } from "types/type";
import { CartContext } from "../../context/cartContext";
import { percentDiscount } from "../../utils/utils";
const Home_Product_Layout_02 = ({ data }: { data: ProductType }) => {
    const { addItemCart } = useContext(CartContext)
    const navigate = useNavigate()
    const navigateDetail = () => {
        navigate(`/product/detail/${data.nameType}/${data.idProduct}/${data.nameProduct.split(" ").join("-")}`)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    return <Fade triggerOnce fraction={0.6} className="col-span-1 md:col-span-2 h-[300px] sm:h-[250px] my-1 mx-4 overflow-hidden" delay={1}>
        <Card className="group w-full h-full rounded-md px-0 lg:px-6 ">
            <CardBody className="relative w-full h-full max-h-[240px] flex flex-wrap justify-center items-center rounded-md bg-zinc-800 bg-opacity-5 border border-solid border-transparent group-hover:border-cyan-500 transition-all cursor-pointer">
                {data.discount !== 0 && <div className="absolute w-[50px] h-[25px] flex items-center justify-center text-white rounded-md bg-red-500 top-1 left-1">
                    -{data?.discount}%
                </div>}
                <div className="w-full lg:w-2/4 h-2/4 lg:h-full max-h-[240px] flex items-center justify-center" onClick={navigateDetail}>
                    <img className="w-full h-full object-contain"
                        loading="eager"
                        src={`${data.imgProduct}`} alt={`images-${data?.nameProduct}`} />
                </div>
                <div className="product-info w-full lg:w-2/4 h-2/4 lg:h-full flex flex-wrap justify-center items-center content-around overflow-hidden py-1 rounded-lg">
                    <div
                        onClick={navigateDetail}
                        className="w-[90%] h-2/4 flex items-center justify-center text-zinc-950 font-bold text-[25px] cursor-pointer"
                    >
                        <span className="truncate text-center lg:text-wrap ">{data?.nameProduct}</span>
                    </div>
                    <div className="w-4/5 sm:w-2/4 h-[25px] flex items-center justify-start text-zinc-950 font-bold text-[18px] truncate">
                        $ {data.discount !== 0
                            ? <><span className="text-red-600 font-semibold line-through">{data.price}</span>&nbsp;{percentDiscount(data.discount!, Number(data.price))}</>
                            : data.price}
                    </div>
                    <Button onClick={() => addItemCart(data)} size="sm" className="w-4/5 sm:w-2/4 bg-zinc-950 text-white">Add to cart</Button>
                </div>
            </CardBody>
        </Card>
    </Fade>
}

export default Home_Product_Layout_02
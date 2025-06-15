import { useNavigate } from "react-router-dom";
import { ProductType } from "types/type";
import Home_Product_Layout from "./home_porudct_layout";
import Home_Product_Layout_02 from "./home_product_layout_02";

interface HomeLayout01Type {
    data: ProductType[] | null
    k: string
    title: string
    subTitle?: string
    link: string
    banner?: string
}

const Home_layout_01 = ({ data, k, title, subTitle, link }: HomeLayout01Type): JSX.Element => {
    const navigate = useNavigate()
    return <div className="w-full h-auto grid grid-cols-1 gap-2 justify-center items-center my-8">
        <div className="relative w-4/5 flex flex-wrap justify-between content-center px-4 mx-auto rounded-md">
            <div className="relative w-full sm:w-2/4 h-auto flex flex-wrap items-center justify-start text-[40px] text-center font-bold font-tech-shark text-zinc-950">
                <span className="truncate ssm:text-wrap px-5">{title}</span>
                <div className="relative mx-0 sm:mx-6 text-[15px] font-bold font-tech-shark text-red-500 z-10 my-1">{subTitle}</div>
            </div>
            <div onClick={() => {
                navigate(link), window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }} className='relative w-[150px] h-[50px] font-bold cursor-pointer flex items-center justify-center text-[20px] text-zinc-950'>
                View All
            </div>
        </div>
        <div className={`${k} w-full h-auto flex flex-wrap justify-center items-around rounded-md p-0 ssm:p-4`}
        >
            <div className='slider-container w-full h-auto flex justify-center'>
                <div className='w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2'>
                    {data?.slice(0, 10).map((d: any, index: number) => index === 0 || index === 1
                        ? <Home_Product_Layout_02 data={d} key={`${k}-${d.idProduct}`} />
                        : <Home_Product_Layout data={d} key={`${k}-${d.idProduct}`} />)}
                </div>
            </div>
        </div>
    </div>
}

export default Home_layout_01
import { StateContext } from "../../context/stateContext"
import { useContext } from "react"
import { CategoryType } from '../../types/type';
import { useNavigate } from "react-router-dom";

const CategoryList = (): JSX.Element => {
    const { type } = useContext(StateContext)
    const navigate = useNavigate()
    return <div className="relative w-full md:w-[90%] h-auto min-h-[100px] flex flex-wrap justify-around items-center p-1 my-2">
        <div className="h-title w-full h-[40px] flex items-end justify-center font-bold font-tech-shark text-[35px]
        bg-clip-text 
        text-transparent bg-[linear-gradient(to_right,theme(colors.cyan.500),theme(colors.blue.500),theme(colors.teal.500),theme(colors.teal.500),theme(colors.blue.400),theme(colors.cyan.500),theme(colors.indigo.500))]
        my-4">Category</div>
        <div className="w-full h-auto min-h-[100px] grid grid-cols-1 ssm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {type && type.map((t: CategoryType) => <div className="h-[100px] relative hover:scale-110 transition-all bg-zinc-500 rounded-md" 
            onClick={() => navigate(`/search/${t.nameType}`)} key={t.idType}>
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
        </div>
    </div>
}

export default CategoryList

import { Code } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import { PostType } from 'types/type'
/* import { formatDate } from '../../utils/utils' */

const PostLayout_02 = ({ data }: { data: PostType }) => {
    const navigate = useNavigate()
    const handleNavigate = (idPost: string | number, title: string) => {
        navigate(`/post/detail/${idPost}/${title}`)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    return <div className="relative group h-[300px] flex flex-col justify-end items-center rounded-md p-2 bg-zinc-950 m-1" key={data.idPost}
        onClick={() => { handleNavigate(data.idPost, data.title) }}
    >
        <div className='backgrounds w-full h-full absolute z-0 top-0 left-0'>
            <div className='relative w-full h-full'>
                <img className='w-full h-full object-cover rounded-md' src={data.thumbnails} alt='images-thumbnails-post' />
                <div className="overlay absolute top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-950 bg-opacity-60 rounded-md cursor-pointer z-0"></div>
            </div>
        </div>
        <div className="w-full flex flex-wrap justify-start items-center z-10">
            <Code className="w-[120px] h-[30px] flex items-center justify-center truncate text-[18px] text-zinc-100 rounded-md bg-gradient-to-r from-zinc-400 bg-zinc-500">
                {data.poster}
            </Code>
            {/* <Code size="sm" className="min-w-[120px] my-1 w-2/5 h-[40px] flex items-center justify-center text-[20px] text-zinc-950 rounded-md bg-gradient-to-r from-cyan-100 bg-cyan-500">
                {formatDate(data.dateAdded)}
                </Code> */}
        </div>
        <div className="relative truncate w-[90%] text-[25px] text-center font-bold font-tech-mono text-white cursor-pointer z-10">
            {data.title}
        </div>
    </div>
}

export default PostLayout_02
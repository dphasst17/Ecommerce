import { Fade } from 'react-awesome-reveal'
import { StateContext } from '../../context/stateContext'
import { useContext } from 'react'
import { PostType } from '../../types/type'
import PostLayout_02 from '../../components/post/post_layout_02'
import { useNavigate } from 'react-router-dom'

const Post = (): JSX.Element => {
    const { post } = useContext(StateContext)
    const navigate = useNavigate()
    return <section className="flex flex-wrap items-center justify-center w-full">
        <div className="relative w-4/5 flex flex-wrap justify-between content-center px-4 mx-auto rounded-md">
            <div className="relative w-2/4 h-auto flex flex-wrap items-center justify-start text-[40px] text-center font-bold font-tech-shark text-zinc-950">
                Posts
            </div>
            <div onClick={() => {
                navigate('/post'), window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }} className='relative w-[150px] h-[50px] font-bold cursor-pointer flex items-center justify-center text-[20px] text-zinc-950'>
                View All
            </div>
        </div>
        <div className="p-0 ssm:p-4 w-[99%] ssm:w-[88%]">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                {post?.slice(0, 4).map((e: PostType) => <Fade
                    triggerOnce
                    className='w-full my-1'
                    fraction={0.8} key={e.idPost}>
                    <PostLayout_02 data={e} />
                </Fade>)}
            </div>
        </div>
    </section>
}

export default Post
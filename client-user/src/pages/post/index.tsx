import { Fade } from 'react-awesome-reveal'
import { StateContext } from '../../context/stateContext'
import { useContext } from 'react'
import { PostType } from '../../types/type'
import PostLayout_02 from '../../components/post/post_layout_02'
import { Code } from '@nextui-org/react'

const Post = () => {
    const { post,postCate } = useContext(StateContext)
    return <section className="flex items-center w-full h-auto min-h-[80vh]">
        <div className="p-4 mx-auto w-[90%] h-auto">
            {/* Category post */}
            <div className='w-full h-auto flex flex-wrap justify-start items-center my-2'>
                {postCate?.map((e: any, index: number) => <Fade triggerOnce fraction={0.5} key={index}>
                    <Code className="cursor-pointer w-[120px] h-[30px] flex items-center justify-center truncate text-[18px] text-zinc-100 rounded-md bg-gradient-to-r from-zinc-600 bg-zinc-500">
                        {e.nameType}
                    </Code>
                </Fade>)    
                }
            </div>
            <div className="grid grid-cols-1 gap-4 lg:gap-8 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {post?.map((e: PostType) => <Fade triggerOnce fraction={0.5} key={e.idPost}>
                    <PostLayout_02 data={e} />
                </Fade>)}
            </div>
        </div>
    </section>
}

export default Post
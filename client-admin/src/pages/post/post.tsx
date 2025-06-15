import { useContext, useState } from "react"
import { StateContext } from "../../context/state"
import { PostType } from "../../types/types"
import { Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { formatDate } from "../../utils/utils"
import { TbTrash } from "react-icons/tb"
import { BiDetail } from "react-icons/bi";
import { GetToken } from "../../utils/token"
import { removePost } from "../../api/post"
import { toast } from "react-toastify"
import ModalPostDetail from "./modalDetail"
const Post_data = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { post, setPost } = useContext(StateContext)
    const [idDel, setIdDel] = useState<number | null>(null)
    const [id, setId] = useState<number | null>(null)
    const handleDeletePost = async (onClose: () => void) => {
        const token = await GetToken()
        token && idDel && removePost(token, idDel).then((res) => {
            if (res.status === 200) {
                toast.success(res.message)
                post && setPost(post.filter((e: PostType) => e.idPost !== idDel))
                onClose()
            }
        })
    }
    return <div className="w-full h-auto flex flex-wrap justify-center items-center">
        <h1 className="w-full text-blue-500 text-[30px] text-center font-bold my-4">Posts</h1>
        <div className="w-[95%] grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
            {post?.map((e: PostType) => <div className="relative group h-auto min-h-[300px] flex flex-wrap items-center justify-center rounded-md bg-zinc-950 m-1" key={e.idPost}
                style={{ backgroundImage: `url(${e.thumbnails})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}
            >
                <div
                    onClick={() => { setIdDel(e.idPost); onOpen() }}
                    className="absolute top-2 left-2 hidden group-hover:flex items-center justify-center w-[60px] h-[30px] bg-red-500 z-20 rounded-md cursor-pointer transition-all">
                    <TbTrash className="w-4/5 h-4/5 text-white" />
                </div>
                <div
                    onClick={() => { setId(e.idPost); onOpen() }}
                    className="absolute top-2 left-20 hidden group-hover:flex items-center justify-center w-[60px] h-[30px] bg-green-500 z-20 rounded-md cursor-pointer transition-all">
                    <BiDetail className="w-4/5 h-4/5 text-white" />
                </div>
                <div className="overlay absolute top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-950 bg-opacity-60 rounded-md cursor-pointer z-0"></div>
                <div className="relative w-full h-auto flex items-center justify-center text-[35px] text-center font-bold font-tech-shark text-white cursor-pointer z-10">
                    {e.title}
                </div>
                <div className="w-full flex flex-wrap justify-evenly items-center z-10">
                    <Code className="min-w-[120px] my-1 w-2/5 h-[40px] flex items-center justify-center text-[20px] text-zinc-950 rounded-md bg-gradient-to-r from-cyan-100 bg-cyan-500">
                        {e.poster}
                    </Code>
                    <Code size="sm" className="min-w-[120px] my-1 w-2/5 h-[40px] flex items-center justify-center text-[20px] text-zinc-950 rounded-md bg-gradient-to-r from-cyan-100 bg-cyan-500">
                        {formatDate(e.dateAdded)}
                    </Code>
                </div>
            </div>)}
        </div>
        <Modal size={id ? "5xl" : "md"} isOpen={isOpen} onOpenChange={() => { onOpenChange(), setId(null) }}>
            {id === null && <ModalContent>
                {(__onClose) => <>
                    <ModalHeader>Delete post</ModalHeader>
                    <ModalBody>Are you sure you want to delete this post? This cannot be undone.</ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="light" onClick={__onClose}>Cancel</Button>
                        <Button color="danger" onClick={() => handleDeletePost(__onClose)}>Delete</Button>
                    </ModalFooter>
                </>}
            </ModalContent>}
            {id && <ModalPostDetail idPost={id} setId={setId} />}
        </Modal>


    </div>
}

export default Post_data
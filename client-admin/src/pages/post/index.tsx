import { useContext } from "react"
import { StateContext } from "../../context/state"
import CreatePosts from "./create"
import ShortKey from "./shortcut"
import Post_data from "./post"
import { Button, Modal, useDisclosure } from "@nextui-org/react"
import ModalAddCate from "./modalAddCate"

const Post = () => {
  const { isDark } = useContext(StateContext)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  return <div className={`w-full h-auto flex flex-wrap justify-center items-center ${isDark ? "bg-[#1F1F1F] text-white" : "bg-[#F5F5F5] text-zinc-950"} !text-zinc-900`}>
    <div className="w-[90%] my-2">
      <h1 className="text-blue-500 text-[25px] text-center font-bold my-4">Create a new Posts</h1>
      <Button onPress={onOpen} color="primary" size="sm" className="my-4">Add category</Button>
      <ShortKey />
      <CreatePosts />
      <Post_data />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
        <ModalAddCate />
      </Modal>
    </div>
  </div>
}

export default Post

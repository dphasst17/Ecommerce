import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import { postGetOne } from "../../api/post"
import 'react-quill/dist/quill.snow.css';// import styles
import "highlight.js/styles/monokai-sublime.min.css";
import { StateContext } from "../../context/state";
const ModalPostDetail = ({ idPost, setId }: { idPost: number, setId: React.Dispatch<React.SetStateAction<number | null>> }) => {
    const { isDark } = useContext(StateContext)
    const [data, setData] = useState<any | null>(null)
    useEffect(() => {
        postGetOne(idPost).then((res) => {
            if (res.status === 200) {
                setData(res.data)
            }
        })
    }, [])
    return <ModalContent>
        {(onClose) => <>
            <ModalHeader>{data && data[0].title}</ModalHeader>
            <ModalBody>
                <div className="h-[70vh] overflow-y-auto">{data && <div className={`ql-editor ${isDark ? "text-zinc-50" : "text-zinc-950"} bg-transparent overflow-y-auto`} dangerouslySetInnerHTML={{ __html: data[0].valuesPosts }} />}</div>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onPress={() => { onClose(), setId(null) }}>Close</Button>
            </ModalFooter>
        </>
        }
    </ModalContent >
}

export default ModalPostDetail
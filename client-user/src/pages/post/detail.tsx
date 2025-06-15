import { useNavigate, useParams } from "react-router-dom"
import 'react-quill/dist/quill.snow.css';// import styles
import "highlight.js/styles/monokai-sublime.min.css";
import { useFetchDataByKey } from "../../hooks/useFetchData";
import { useContext, useEffect, useState } from "react";
import { Button, Code, Pagination } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { GetToken } from "../../utils/token";
import { commentPostInsert, getCommentByPost } from "../../api/post";
import { CommentResType, CommentType } from "types/type";
import { userStore } from "../../store/user";
import { StateContext } from "../../context/stateContext";
import CommentUi from "../../components/ui/comment";
const PostsDetail = () => {
    const { register, handleSubmit } = useForm()
    const { isLogin } = useContext(StateContext)
    const { user } = userStore()
    const navigate = useNavigate()
    const param = useParams()

    const { data } = useFetchDataByKey('posts', 'postGetDetail', Number(param.idPost))
    const { data: commentPost } = useFetchDataByKey('posts', 'getCommentByPost', Number(param.idPost))

    const [value, setValue] = useState("")
    const [activePage, setActivePage] = useState(1)
    const [dComment, setDComment] = useState<CommentResType | null>(null)
    const [comment, setComment] = useState<CommentType[] | null>(null)
    const [firstPage, setFirstPage] = useState<CommentType[] | []>([])
    useEffect(() => {
        document.title = `${param.name}`
    }, [param])
    useEffect(() => {
        commentPost && (
            setDComment({ total: commentPost.data.total, total_page: commentPost.data.total_page, page: commentPost.data.page }),
            setComment(commentPost.data.detail),
            setFirstPage(commentPost.data.detail),
            setActivePage(commentPost.data.page)
        )
    }, [commentPost])
    const onSubmit = async (data: any) => {
        const token = await GetToken()
        const dataInsert = [{
            idPost: Number(param.idPost!),
            commentValue: data.message,
            created_date: new Date().toISOString().split("T")[0]
        }]
        token && commentPostInsert(token, dataInsert)
            .then(res => {
                if (res.status === 201 && comment && dComment) {
                    const newDComment: CommentResType = {
                        total: dComment?.total + 1,
                        total_page: Math.ceil((dComment.total + 1) / 4),
                        page: 1
                    }
                    const appendData = [{ ...dataInsert[0], nameUser: user ? user[0].nameUser : '', img: '', idComment: res.data.id }, ...firstPage.slice(0, 3)]
                    setFirstPage(appendData)
                    setComment(appendData)
                    setDComment(newDComment)
                    setActivePage(1)
                    setValue("")
                }
            })
    }
    //handle change page
    const handleChange = (e: any) => {
        setActivePage(e)
        getCommentByPost(Number(param.idPost), e)
            .then(res => {
                if (res.status === 200 && comment) {
                    setDComment(res.data),
                        setComment(res.data.detail)
                }
            })
    }
    return <div className="PostsDetail w-full h-auto min-h-[90vh] flex flex-col xl:flex-row items-start justify-evenly">
        {/* post detail */}
        <div className="w-[99%] xl:w-3/5 h-auto p-10">
            {data !== null && data.data.map((e: any) => <div className="ql-snow" key={e.idPost}>
                <h1 className="text-4xl text-black font-bold text-center">{e.title}</h1>
                <div className={`ql-editor text-slate-700 bg-transparent`} dangerouslySetInnerHTML={{ __html: e.valuesPosts }} />
            </div>)}
        </div>
        {/* input comment */}
        <div className="w-3/5 xl:w-1/4 h-auto min-h-screen flex flex-col justify-start">
            {isLogin && <div className="form-comment w-full flex flex-col justify-start pt-10">
                <textarea {...register('message', { required: true })} rows={5}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="rounded-md p-6 w-full text-sm outline-none border-solid border-zinc-500 border  text-zinc-900 placeholder-gray-400"
                    placeholder="Write a comment..." required />
                <Button className="w-[100px] h-[30px] my-2 shadow-lg bg-zinc-600 text-zinc-50" size="sm"
                    onClick={() => handleSubmit(onSubmit)()}>Post</Button>
            </div>}
            {!isLogin && <p className="text-zinc-900">
                <Code radius="sm" size="sm" className="cursor-pointer" color="danger" onClick={() => navigate('/auth')}>Login</Code> to comment
            </p>}
            <Code radius="sm" className="flex items-center justify-center my-2 font-bold cursor-pointer bg-zinc-600 text-zinc-50">Comment for post</Code>
            <div className="comment-detail w-full flex flex-wrap items-center justify-center">
                <div className="comment-list w-full flex flex-wrap items-center justify-center">
                    {comment && comment.map((d: CommentType) => <CommentUi key={d.idComment} d={d} />)}
                </div>
                {/* comment pagination*/}
                {dComment && comment && comment.length !== 0 && <Pagination isCompact size="lg" showControls page={activePage}
                    total={dComment.total_page} initialPage={1} onChange={(e) => handleChange(e)} />}
            </div>
        </div>

    </div>

}
export default PostsDetail
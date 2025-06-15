import { useFetchDataByKey } from "../../../hooks/useFetchData"
import { CommentResType, CommentType } from "../../../types/type"
import {  Code, Pagination } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import { getCommentByProduct, insertComment } from "../../../api/comment"
import { GetToken } from "../../../utils/token"
import { StateContext } from "../../../context/stateContext"
import { useNavigate } from "react-router-dom"
import { userStore } from "../../../store/user"
import CommentUi from "../../../components/ui/comment"


const CommentProduct = ({ idProduct }: { idProduct: number }) => {
  const navigate = useNavigate()
  const { isLogin } = useContext(StateContext)
  const { user } = userStore()
  const [value, setValue] = useState("");
  const [activePage, setActivePage] = useState(1)
  const [dComment, setDComment] = useState<CommentResType | null>(null)
  const [comment, setComment] = useState<CommentType[] | null>(null)
  const [firstPage, setFirstPage] = useState<CommentType[] | []>([])
  const { data } = useFetchDataByKey('comment', 'getCommentByProduct', idProduct)
  useEffect(() => {
    data && (
      setDComment({ total: data.data.total, total_page: data.data.total_page, page: data.data.page }),
      setComment(data.data.detail),
      setFirstPage(data.data.detail),
      setActivePage(data.data.page)
    )
  }, [data])
  const handleChange = (e: any) => {
    setActivePage(e)
    getCommentByProduct(idProduct, e)
      .then(res => {
        res.status === 200 && (
          setDComment(res.data),
          setComment(res.data.detail)
        )
      })
  }
  const postComment = async () => {
    const currentDate = new Date().toISOString().split("T")[0]
    const token = await GetToken()
    const data = [{
      dateComment: currentDate,
      commentValue: value,
      idProduct: idProduct
    }]
    token && value !== "" && insertComment(token, data)
      .then(res => {
        if (comment && dComment) {
          const newDComment: CommentResType = {
            total: dComment?.total + 1,
            total_page: Math.ceil((dComment.total + 1) / 4),
            page: 1
          }
          const appendData = [{ ...data[0], nameUser: user ? user[0].nameUser : '', img: '', idComment: res.data.id }, ...firstPage.slice(0, 3)]
          setFirstPage(appendData)
          setComment(appendData)
          setDComment(newDComment)
          setValue("")
        }
      })
  }
  return <div className="w-full h-auto flex flex-wrap justify-between p-6 border-t border-solid border-zinc-300 mt-6">
    <div className={`w-full flex flex-wrap ${isLogin ? 'justify-end' : 'justify-center'}`}>
      {isLogin && <>
        <div className="mb-4 w-full">
          <div className="flex justify-between items-center py-2 px-3 bg-zinc-950 border-b border-gray-600 rounded-t-lg">
            <div className="flex flex-wrap items-center divide-gray-200">
              <div className="flex items-center space-x-1 sm:pr-4">
                <button type="button" title="btn" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                </button>
                <button type="button" title="btn" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                </button>
                <button type="button" title="btn" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                </button>
                <button type="button" title="btn" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
                <button type="button" title="btn" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
                </button>
              </div>
            </div>
            <button type="button" title="btn" data-tooltip-target="tooltip-fullscreen" className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            </button>
            <div id="tooltip-fullscreen" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
              Show full screen
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
          <div className="py-2 px-4  rounded-b-lg shadow-lg text-black">
            <textarea id="editor" rows={6} value={value} onChange={(e) => { setValue(e.target.value) }}
              onKeyDown={(e) => { e.key === "Enter" && !e.shiftKey && postComment() }}
              className="block px-0 w-full text-sm text-gray-800 outline-none border-0 focus:ring-0 ieruyqweir dark:placeholder-gray-400" placeholder="Write a comment..." required />
          </div>
        </div>
        <button
          onClick={() => { postComment() }}
          className="h-[50px] cursor-pointer inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-1 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
          Comment
        </button>
      </>}
      {!isLogin && <p className="text-zinc-900">
        <Code radius="sm" size="sm" className="cursor-pointer" color="danger" onClick={() => navigate('/auth')}>Login</Code> to comment
      </p>}
    </div>
    <div className="comment-detail w-full flex flex-wrap items-center justify-center">
      <div className="comment-list w-full flex flex-wrap items-center justify-center">
        {comment && comment.map((d: CommentType) => <CommentUi key={d.idComment} d={d} />)}
      </div>
      {dComment && comment && comment.length !== 0 && <Pagination isCompact size="lg" showControls page={activePage}
        total={dComment.total_page} initialPage={1} onChange={(e) => handleChange(e)} />}
    </div>
  </div>
}

export default CommentProduct
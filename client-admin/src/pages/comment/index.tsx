import { useContext } from "react"
import { StateContext } from "../../context/state"
import CommentComponent from "../../components/comment/comment"

const Comment = () => {
  const { comment } = useContext(StateContext)
  return <div className="w-full h-auto min-h-[95.6vh] thumbnails-color flex flex-wrap content-around justify-center">
    {comment.product && <CommentComponent type="Product" data={comment.product} />}
    {comment.post && <CommentComponent type="Post" data={comment.post} />}
  </div>
}

export default Comment
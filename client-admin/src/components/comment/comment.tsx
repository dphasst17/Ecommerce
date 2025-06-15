import { useContext, useState } from "react"
import { CommentType } from "../../types/types"
import { Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { formatDate, pagination } from "../../utils/utils"
import { GetToken } from "../../utils/token"
import { deleteComment } from "../../api/comment"
import { DeleteIcon } from "../../components/icon/delete";
import { StateContext } from "../../context/state"

const CommentComponent = ({ type, data }: { type: string, data: CommentType[] }) => {
    const { isDark, setComment } = useContext(StateContext)
    const [activePage, setActivePage] = useState(1)
    const handleDeleteComment = async (id: number, type: string) => {
        const token = await GetToken()
        token && deleteComment(token, type, id)
            .then(res => {
                alert(res.message)
                if (res.status === 200) {
                    setComment && setComment((prevData: any) => ({ ...prevData, [type]: data.filter((item: any) => item.id !== id) }))
                }
            })
            .catch(err => console.log(err))
    }
    return <div className="w-[90%] flex flex-wrap justify-center items-center mb-10">
        <div className={`relative w-full h-[65px] text-[20px] `}>
            <div className="w-[250px] h-[60px] relative hover:scale-110 transition-all">
                <div className='h-full flex items-center justify-center'
                    style={{
                        background: 'white',
                        clipPath: 'polygon(80% 0%, 0% 0px, 0% 60%, 20% 100%, 100% 100%, 100% 40%)'
                        ,
                    }}
                ></div>
                <div className='absolute top-0 left-0 w-full h-full cursor-pointer flex items-center justify-center font-bold 
                text-[20px] px-3 border border-solid borderr-zinc-50'
                    style={{
                        backgroundImage: 'url(https://i.pinimg.com/564x/7a/48/81/7a488118c70f73d00e8d3e644d53d5c9.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        clipPath: 'polygon(79% 1%, 0.5% 1px, 0.5% 59%, 21% 99%, 99% 99%, 99% 41%)'
                    }}
                >
                    Comment {type}
                </div>
            </div>
        </div>
        <Table aria-label="Table comment">
            <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>User</TableColumn>
                <TableColumn>Name {type}</TableColumn>
                <TableColumn>Comment</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
                {data && data.slice((activePage * 20) - 20, activePage * 20).map((item: CommentType) => <TableRow className={`${isDark ? "text-white" : "text-zinc-950"}`} key={`comment-${item.id}`}>
                    <TableCell>#{item.id}</TableCell>
                    <TableCell>{item.nameUser}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>{formatDate(item.created_date)}</TableCell>
                    <TableCell>
                        <Button size="sm" radius="sm" isIconOnly color="danger" onClick={() => handleDeleteComment(item.id, type.toLocaleLowerCase())}>
                            <DeleteIcon className="text-[20px]" />
                        </Button>
                    </TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
        {data.length !== 0 && <Pagination className="my-1" isCompact size="lg" showControls page={activePage} total={pagination(20, data.length)}
            initialPage={1} onChange={(e: any) => { setActivePage(e) }} />}
    </div >
}

export default CommentComponent
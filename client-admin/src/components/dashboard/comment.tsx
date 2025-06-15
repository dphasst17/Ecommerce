import { useContext } from 'react'
import { StateContext } from '../../context/state'
import { formatDate } from '../../utils/utils'

const Comment_component = ({ data, type }: { data: any[], type: string }) => {
    const { role, isDark } = useContext(StateContext)

    return <div className={`w-[98%] ${role === 0 ? "xl:w-[49.5%]" : "xl:w-[32%]"} 
        ${isDark ? 'text-white' : 'text-zinc-950'} 
        shadow-md
        border border-solid border-zinc-500 h-auto min-h-[400px] rounded-md flex flex-wrap items-center my-1 p-2`}
    >
        <h1 className="w-full text-[30px] text-center font-bold font-mono">Comment {type}</h1>
        <div className="w-full h-[300px] flex flex-wrap justify-center  items-center">
            <div className="w-full h-[50px] flex items-center justify-center text-[20px] font-bold font-mono border-b border-solid border-zinc-400">
                <div className="w-[10%]">Id</div>
                <div className="w-[15%]">Name</div>
                <div className="w-3/5">Comment</div>
                {role === 0 && <div className="w-[15%]">Date</div>}
            </div>
            {data && data.map((item: any) =>
                <div className="w-full h-[50px] flex items-center justify-center text-[20px] font-bold font-mono" key={`Comment-post-${item.id}`}>
                    <div className="w-[10%]">#{item.id}</div>
                    <div className="w-[15%]">{item.nameUser}</div>
                    <div className="w-3/5">{item.commentValue}</div>
                    {role === 0 && <div className="w-[15%]">{formatDate(item.created_date)}</div>}
                </div>
            )}
        </div>
    </div>
}

export default Comment_component
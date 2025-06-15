import { Kbd } from "@nextui-org/react"
import { KbdKey } from "../../types/quill-short-key-type"
import { StateContext } from "../../context/state"
import { useContext } from "react"
interface IShortKey {
    name: string
    detail: {
        first: KbdKey
        second: KbdKey | string,
        third: string,
        result: string
    }[]
}
// UI SHORT KEY
const ShortKey = () => {
    const shortKey: IShortKey[] = [
        {
            name: 'heading',
            detail: [
                {
                    first: 'ctrl',
                    second: '2',
                    third: '',
                    result: 'Heading 1'
                },
                {
                    first: 'ctrl',
                    second: '3',
                    third: '',
                    result: 'Heading 2'
                },
                {
                    first: 'ctrl',
                    second: '4',
                    third: '',
                    result: 'Heading 3'
                },
                {
                    first: 'ctrl',
                    second: '5',
                    third: '',
                    result: 'Heading 4'
                },
                {
                    first: 'ctrl',
                    second: '6',
                    third: '',
                    result: 'Heading 5'
                },
                {
                    first: 'ctrl',
                    second: '7',
                    third: '',
                    result: 'Heading 6'
                },
                {
                    first: 'ctrl',
                    second: '0',
                    third: '',
                    result: 'Normal'
                }
            ]
        },
        {
            name: 'size',
            detail: [
                {
                    first: 'ctrl',
                    second: 'shift',
                    third: '1',
                    result: 'Size Small'
                },
                {
                    first: 'ctrl',
                    second: 'shift',
                    third: '2',
                    result: 'Size Normal'
                },
                {
                    first: 'ctrl',
                    second: 'shift',
                    third: '3',
                    result: 'Size Large'
                },
                {
                    first: 'ctrl',
                    second: 'shift',
                    third: '4',
                    result: 'Size Huge'
                }
            ]
        },
        {
            name: 'align',
            detail: [
                {
                    first: 'ctrl',
                    second: 'E',
                    third: '',
                    result: 'Align Center'
                },
                {
                    first: 'ctrl',
                    second: 'R',
                    third: '',
                    result: 'Align Right'
                },
                {
                    first: 'ctrl',
                    second: 'J',
                    third: '',
                    result: 'Align Justify'
                }
            ]
        },
        {
            name: 'more',
            detail: [
                {
                    first: 'ctrl',
                    second: 'B',
                    third: '',
                    result: 'Font Bold'
                },
                {
                    first: 'ctrl',
                    second: 'I',
                    third: '',
                    result: 'Italics'
                },
                {
                    first: 'ctrl',
                    second: 'U',
                    third: '',
                    result: 'Underline'
                },
                {
                    first: 'ctrl',
                    second: 'shift',
                    third: 'L',
                    result: 'Code Block'
                }
            ]
        }
    ]
    const { isDark } = useContext(StateContext)
    return <div className="shortKey-container md:w-[90%] h-auto flex flex-wrap justify-around rounded-lg px-2">
        <div className="w-[98%] h-auto">
            <Kbd className="rounded-md cursor-pointer mx-1" keys={["command"]}>: Command Key</Kbd>
            <Kbd className="rounded-md cursor-pointer mx-1" keys={["ctrl"]}>: Control Key</Kbd>
            <Kbd className="rounded-md cursor-pointer mx-1" keys={["shift"]}>:Shift Key</Kbd>
        </div>
        {shortKey.map(e => <div className={`${e.name}  w-[98%] lg:w-[23%] h-auto flex flex-col flex-wrap`} key={e.name}>
            {e.detail.map(d => <span className={`w-full flex flex-wrap items-center ${isDark ? "text-white" : "text-zinc-950"} font-semibold my-2`} key={d.result}>
                <Kbd keys={d.third !== "" && d.second === "shift" ? [d.first, d.second] : [d.first]}>{d.third !== "" ? d.third : d.second}</Kbd>
                : {d.result}
            </span>)}

        </div>)}

    </div>
}
export default ShortKey
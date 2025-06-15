import { ArrowUpRight} from "lucide-react"
import { FormatPercentChange } from "../../utils/utils";

const Analyze = ({ title,total, currVar, lastVar, icon }: { title: string, total:number,currVar: number, lastVar: number, icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element }) => {
    const Icon = icon
    return <div className="col-span-8 sm:col-span-4 md:col-span-2 h-[200px] bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50 rounded-md">
        <div className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium">{title}</div>
            <Icon className="h-4 w-4 text-muted-foreground"/>
        </div>
        <div>
            <div className="text-3xl font-bold">{total}</div>
            <div className="text-white flex items-center gap-1">+{currVar}</div>
            <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> {FormatPercentChange(currVar, lastVar)}
                </span>{" "}
                from last month
            </p>
        </div>
    </div>
};

export default Analyze;

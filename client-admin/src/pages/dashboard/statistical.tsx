import { useContext, useEffect, useState } from "react";
import { StateContext } from "../../context/state";
/* import { formatDate } from "../../utils/utils" */
import Analyze from "../../components/dashboard/analyze";
import { Box, DollarSign, Laptop, Users } from "lucide-react";
import Charts from "./charts/chart";
import PieCharts from "./charts/pie";
import Order_Table from "./order";
import Sold from "./sold";
const Statistical = () => {
  const { statistical } = useContext(StateContext);
  const [currentTime, setCurrentTime] = useState(new Date())
  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)

  }, [])
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="dashboard-statistical w-full h-auto min-h-screen grid grid-cols-8 gap-6  pt-2 px-2 mb-2">
      <div className="col-span-8 lg:col-span-3 xl:col-span-2 h-[200px] bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden rounded-md">
        <div className="p-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 border-b border-slate-700/50">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1 font-mono">
                SYSTEM TIME
              </div>
              <div className="text-3xl font-mono text-cyan-400 mb-1">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-slate-400">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Uptime</div>
                <div className="text-sm font-mono text-slate-200">
                  14d 06:42:18
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                <div className="text-sm font-mono text-slate-200">
                  {currentTime.toString().split(" ")[5]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-8 lg:col-span-5 xl:col-span-6 grid grid-cols-8 gap-6">
        {statistical.product && (
          <Analyze
            title="Total Product"
            total={statistical.product[0].total}
            currVar={statistical.product[0].new.new}
            lastVar={statistical.product[0].last.last}
            icon={() => <Laptop />}
          />
        )}
        {statistical.user && (
          <>
            <Analyze
              title="Total User"
              total={statistical.user[0].total_user}
              currVar={statistical.user[0].current_month.count}
              lastVar={statistical.user[0].last_month.count}
              icon={() => <Users />}
            />
          </>
        )}
        {statistical.order && (
          <Analyze
            title="Total Order"
            total={statistical.order[0].total}
            currVar={statistical.order[0].new}
            lastVar={statistical.order[0].last}
            icon={() => <Box />}
          />
        )}
        {statistical.revenue && (
          <Analyze
            title="Revenue"
            total={statistical.revenue.revenue}
            currVar={statistical.revenue.detail[0].monthlyTotal}
            lastVar={statistical.revenue.detail[1].monthlyTotal}
            icon={() => <DollarSign />}
          />
        )}
      </div>
      <div className="col-span-8 sm:col-span-4 lg:col-span-3 flex flex-col bg-zinc-950 px-2 py-3 rounded-md border border-solid border-zinc-200">
        <div className="title h-[50px]">
          <h1 className="text-2xl font-bold">Revenue By Month</h1>
        </div>
        <Charts />
      </div>
      <div className="col-span-8 sm:col-span-4 lg:col-span-2 flex flex-col bg-zinc-950 px-2 py-3 rounded-md border border-solid border-zinc-200">
        <div className="title h-[50px]">
          <h1 className="text-2xl font-bold">Sold Product By Type</h1>
        </div>
        <div className="h-[400px]"><PieCharts /></div>
      </div>
      <div className="col-span-8 lg:col-span-3 flex flex-col bg-zinc-950 px-2 py-3 rounded-md border border-solid border-zinc-200">
        <div className="title h-[50px]">
          <h1 className="text-2xl font-bold">Top Product</h1>
        </div>
        <div className="h-[400px]"><Sold /></div>
      </div>
      <div className="col-span-8 flex flex-col bg-zinc-950 px-2 py-3 rounded-md border border-solid border-zinc-200">
        <div className="title h-[50px]">
          <h1 className="text-2xl font-bold">Order List</h1>
        </div>
        <div className="h-[400px]"><Order_Table /></div>
      </div>
    </div>
  );
};

export default Statistical;

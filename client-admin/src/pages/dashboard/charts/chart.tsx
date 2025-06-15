import { useContext, useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, Tooltip, XAxis, YAxis } from "recharts"
import { StateContext } from "../../../context/state";
import { ChartContainer } from "../../../components/ui/chart"

const Charts = () => {
    const { statistical } = useContext(StateContext);
    const [data,setData] = useState([])
    useEffect(() => {
        statistical.revenue && setData(statistical.revenue.detail.map((item: any,index:number) => ({ month: item.month, revenue: item.monthlyTotal + (100 * index) })).reverse())
    },[statistical])
    // Format currency for axis labels
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`
  }
    return <div className="w-full">
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[400px] w-full"
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
        <YAxis axisLine={false} tickLine={false} tickMargin={10} tickFormatter={formatCurrency} />
        <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
        <Legend />
        {/* <ChartTooltip content={<ChartTooltipContent formatter={(value:any) => `$${Number(value).toLocaleString()}`} />} /> */}
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#3b82f6" maxBarSize={60} activeBar={<Rectangle fill="#3b82f6" stroke="blue" />} />
      </BarChart>
    </ChartContainer>
    </div>
}
export default Charts

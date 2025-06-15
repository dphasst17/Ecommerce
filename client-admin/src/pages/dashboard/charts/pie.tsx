import { useContext, useEffect, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer,Cell,Tooltip,Legend } from 'recharts';
import { StateContext } from '../../../context/state';




const PieCharts = () => {
    const {statistical} = useContext(StateContext)
    const [data,setData] = useState([])
    useEffect(() => {
      statistical.order && setData(statistical.order[0].type.map((item: any) => ({ name: item.nameType, value: item.total })))  
    },[statistical])
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={200}>
      <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
         <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} contentStyle={{ borderRadius: "8px" }} />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieCharts;

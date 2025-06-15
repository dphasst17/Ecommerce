import { Avatar, AvatarFallback, AvatarImage } from "@nextui-org/react"
import { Input } from "@nextui-org/react"
import { Search } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { StateContext } from "../../context/state"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

const Sold = () => {
  const {statistical} = useContext(StateContext);
  const [data,setData] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  useEffect(() => {
    statistical.product && setData(statistical.product[0].order)
  },[statistical.product])
  return  <div className="space-y-4 bg-zinc-950 p-3 rounded-md">      
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">Id</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead >Sold</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.idProduct}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8" src={order.imgProduct || "/placeholder.svg"} alt={order.nameProduct} />
                    <div className="">
                      <p className="text-sm font-medium leading-none">{order.nameProduct}</p>                      
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">${order.price}</TableCell>
                <TableCell className="hidden md:table-cell">{order.sold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

}
export default Sold;

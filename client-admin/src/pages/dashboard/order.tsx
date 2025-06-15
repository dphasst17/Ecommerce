import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Input,Avatar } from "@nextui-org/react"
import { Search } from "lucide-react"
import { useEffect,useContext, useState } from "react"
import { StateContext } from "../../context/state"
const Order_Table = () => {
  const {statistical} = useContext(StateContext)
  const [data,setData] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  useEffect(() => {
    statistical.orderList && setData(statistical.orderList)
  },[statistical.orderList])
  return <div className="space-y-4 bg-zinc-950 p-3 rounded-md">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search orders..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Payment</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="hidden sm:table-cell">Items</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map((order:any) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.idOrder}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8" src={order.avatar || "/placeholder.svg"} alt={order.nameUser} />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium leading-none">{order.nameUser}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{order.created_at}</TableCell>
                <TableCell className="hidden md:table-cell">{order.method}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>
                    {order.orderStatus}
                  </div>
                </TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
                <TableCell className="hidden sm:table-cell">{order.count}</TableCell>
                <TableCell>
                  {/*<DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View order details</DropdownMenuItem>
                      <DropdownMenuItem>View customer</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Update status</DropdownMenuItem>
                      <DropdownMenuItem>Cancel order</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>*/}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
}
export default Order_Table

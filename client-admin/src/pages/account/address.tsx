import {  Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { userStore } from "../../store/user"
import { UserAddressType } from "../../types/types"
import { useState } from "react"
import { pagination } from "../../utils/utils"

const Address = () => {
    const { address } = userStore()
    const [addressPage, setAddressPage] = useState(1)
    return <div className="staff w-[95%] md:w-4/5 xl:w-[48%] min-h-[400px] flex flex-col pt-1 mb-20 md:mb-0">
        <Table aria-label="Table Address" classNames={{wrapper:"h-[250px]"}}>
            <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>NAME</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>DETAIL</TableColumn>
            </TableHeader>
            <TableBody>
                {(address ?? []).slice((addressPage * 5) - 5, addressPage * 5).map((a:UserAddressType) => <TableRow className="cursor-pointer" key={`address-${a.idAddress}`}>
                    <TableCell>#{a.idAddress}</TableCell>
                    <TableCell>#{a.nameUser}</TableCell>
                    <TableCell>{a.typeAddress}</TableCell>
                    <TableCell>{a.detail}</TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
        {address && address.length  > 5 && <Pagination className="my-1" isCompact size="lg" showControls page={addressPage} total={pagination(5, address.length)}
            onChange={(e: any) => { setAddressPage(e) }}  />}
    </div>
}

export default Address
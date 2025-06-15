import { TableCell, TableRow } from "@nextui-org/react"

const Spacer_row = ({ row }: { row: number }) => {
    return <TableRow className="w-full h-10 grid grid-cols-12 gap-2 p-4 my-2">
        {[...Array(row)].map((_c, _i) => <TableCell className="w-full h-full">#{_i}</TableCell>)}
    </TableRow>
}

export default Spacer_row
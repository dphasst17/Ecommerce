import { StateContext } from "../../context/stateContext"
import { useContext } from "react"
import Home_layout_01 from "../../components/home/home_layout_01"
import { formatDateSliceYear } from "../../utils/utils"

const SaleEvent = (): JSX.Element => {
    const { sale } = useContext(StateContext)
    return sale && sale.length !== 0 && <Home_layout_01 data={sale[0].detail.slice(0, 10)} k="h-sale"
        title="Sale" subTitle={`${formatDateSliceYear(sale[0].start_date)} - ${formatDateSliceYear(sale[0].end_date)}`} link={"/sale"}
        banner="https://i.pinimg.com/736x/24/67/de/2467dec1d8c5b03402e8ed025ec9a8c5.jpg"
    />
}

export default SaleEvent
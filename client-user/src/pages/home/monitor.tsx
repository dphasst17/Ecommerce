import { StateContext } from '../../context/stateContext';
import { useContext, useEffect, useState } from 'react'
import Home_layout_01 from '../../components/home/home_layout_01';

const Monitor = (): JSX.Element => {
    const { product } = useContext(StateContext);
    const [data, setData] = useState<any[] | null>(null);
    useEffect(() => {
        product && setData(product.filter((f: any) => f.type === "monitor")[0].data.filter((f: any) => f.view > 0))
    }, [product]);
    return <Home_layout_01 data={data} k="h-monitor" title="Monitor" link={"/product"} banner="https://i.pinimg.com/564x/bf/c1/64/bfc1641b060a94a7a491b5aeedf87c89.jpg" />
}

export default Monitor
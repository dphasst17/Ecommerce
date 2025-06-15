import { StateContext } from '../../context/stateContext';
import { useContext, useEffect, useState } from 'react'
import Home_layout_01 from '../../components/home/home_layout_01';

const Laptop = (): JSX.Element => {
    const { product } = useContext(StateContext);
    const [data, setData] = useState<any[] | null>(null);
    useEffect(() => {
        product && setData(product.filter((f: any) => f.type === "laptop")[0].data.filter((f: any) => f.view > 10))
    }, [product]);
    return <Home_layout_01 data={data} k="h-laptop" title="Laptop" link={"/product"} />
}

export default Laptop
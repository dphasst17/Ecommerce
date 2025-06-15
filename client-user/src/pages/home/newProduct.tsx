
import { StateContext } from '../../context/stateContext';
import { useContext, useEffect, useState } from 'react'
import { ProductType } from 'types/type';
import Home_layout_01 from '../../components/home/home_layout_01';
const NewProduct = (): JSX.Element => {
    const { newProduct } = useContext(StateContext);
    const [data, setData] = useState<ProductType[] | null>(null);
    useEffect(() => {
        newProduct && setData(newProduct)
    }, [newProduct]);

    return <Home_layout_01 data={data} k="h-new" title="New Product" link={"/product"} banner="https://i.pinimg.com/564x/7f/73/31/7f73314b76da0e60d3e3d543015c5aa9.jpg" />
}

export default NewProduct
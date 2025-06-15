import { ProductFilterType, ProductType } from 'types/type';
import { useEffect, useState } from 'react'
import Home_Product_Layout from '../../components/home/home_porudct_layout';
import { Button, Pagination } from '@nextui-org/react';
import { pagination } from '../../utils/utils';
import FilterBrand from './layout/filterBrand';
import FilterPrice from './layout/filterPrice';
import { SortedData } from '../../utils/handle';
import { useParams } from 'react-router-dom';
import Empty_Data from '../../components/error/empty';
import { productGetByKey } from '../../api/product';
import FilterType from './layout/filterType';

const SearchProduct = () => {
    const param = useParams()
    const [data, setData] = useState<ProductType[] | null>(null)
    const [currentData, setCurrentData] = useState<ProductType[] | null>(null);
    const [listBrand, setListBrand] = useState<string[]>([])
    const [activePage, setActivePage] = useState<number>(1)
    const [currentType, setCurrentType] = useState<string>("");
    const [filter, setFilter] = useState<ProductFilterType>({ brand: [], price: "", detail: [] })
    useEffect(() => {
        productGetByKey(param.key!)
            .then(res => {
                if (res.status !== 200) return
                setData(res.data)
                setCurrentData(res.data)
                setListBrand(Array.from(new Set(res.data.map((d: ProductType) => d.brand.toLocaleLowerCase()))))
            })
    }, [param])
    useEffect(() => {
        const filterData = async () => {
            setActivePage(1)
            const currentProductData = data || []
            const filteredByType = currentType !== "" ? currentProductData.filter((product: ProductType) => product.nameType === currentType) : currentProductData
            const filteredByBrand = filter.brand.length !== 0 ? (currentType !== "" ? filteredByType : currentProductData).filter((product: ProductType) => filter.brand.includes(product.brand))
                : (currentType !== "" ? filteredByType : currentProductData)
            setCurrentData(filteredByBrand)
        }
        filterData()
    }, [filter, currentType])
    SortedData(currentData, filter.price, setCurrentData, setActivePage)
    return currentData && currentData.length !== 0 ? <div className='product w-full h-auto flex flex-col items-center justify-center overflow-hidden'>
        <div className='filter w-[90%] flex flex-wrap my-4 text-zinc-900'>
            {data && <FilterType type={Array.from(new Set(data.map((d: ProductType) => d.nameType)))} currentType={currentType} setCurrentType={setCurrentType} />}
            {listBrand && listBrand.length > 1 && <FilterBrand listBrand={listBrand} setFilter={setFilter} filterData={filter} />}

            <FilterPrice setFilter={setFilter} filterData={filter} />
            <Button size='sm' radius='sm' color='danger' className='mx-1' onClick={() => { setFilter({ brand: [], price: "", detail: [] }), setCurrentType(""), setCurrentData(data) }}>CLEAR</Button>
        </div>
        <div className='product-layout w-[90%] h-auto min-h-[760px]  grid grid-cols-1 ssm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {currentData && currentData.slice((12 * activePage) - 12, 12 * activePage).map((d: ProductType) =>
                <Home_Product_Layout data={d} key={`search-${d.idProduct}`} />)}
        </div>
        {currentData && <Pagination isCompact size="lg" showControls page={activePage} total={pagination(12, currentData.length)} initialPage={1} onChange={(e) => { setActivePage(e) }} />}
    </div> : <Empty_Data />
}

export default SearchProduct

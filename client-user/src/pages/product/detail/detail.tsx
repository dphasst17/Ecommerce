import { useContext } from 'react'
import UiDetail from './ui'
import { useParams } from 'react-router-dom'
import { StateContext } from '../../../context/stateContext'
import Product_Layout_01 from '../../../components/product/layout_01'
import { ProductType } from '../../../types/type'

const DetailProduct = () => {
  const params = useParams()
  const { product } = useContext(StateContext)
  return <div className="font-[sans-serif] bg-white">
    <UiDetail nameType={params.nameType!} idProduct={Number(params.idProduct)} />
    <div className='w-full grid gird-cols-1 gap-2 justify-center items-center'>
      <h1 className='text-[25px] text-zinc-950 font-bold text-center'>Similar Products</h1>
      <div className='similar-detail w-full h-auto grid grid-cols-6 gap-2 px-6'>
        {product && product.filter((f: { type: string, data: ProductType[] }) => f.type === params.nameType)[0].data
          .filter((f: ProductType) => f.idProduct !== Number(params.idProduct)).slice(0, 6)
          .map((d: ProductType) => <Product_Layout_01 data={d} key={`product-${d.idProduct}`} />)}
      </div>
    </div>
  </div>
}

export default DetailProduct
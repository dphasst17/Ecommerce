import { Code } from "@nextui-org/react"
import { useFetchDataByKey } from "../../../hooks/useFetchData"
import { useContext, useEffect, useState } from "react"
import CommentProduct from "./comment"
import { productGetDetail } from "../../../api/product"
import { CartContext } from "../../../context/cartContext"

const UiDetail = ({ nameType, idProduct }: { nameType: string, idProduct: number }) => {
  const { addItemCart } = useContext(CartContext)
  const [data, setData] = useState<any[] | null>(null)
  const [currentImage, setCurrentImage] = useState("")
  const [column, setColumn] = useState<any[] | null>(null);
  const [option, setOption] = useState<number>(1)
  const { data: col } = useFetchDataByKey('product', 'getColByType', nameType)
  useEffect(() => {
    productGetDetail({ type: nameType, idProduct: idProduct }).then((res) => {
      if (res.status === 200) {
        setData(res.data)
        setCurrentImage(res.data[0].imgProduct[0].img)
        document.title = res.data[0].nameProduct
      }
    })
  }, [nameType, idProduct])
  useEffect(() => {
    col && setColumn(col.data)
  }, [col])
  const handleAddCart = (data: any) => {
    const convertData = {
      idProduct: data.idProduct,
      nameProduct: data.nameProduct,
      price: data.price,
      imgProduct: data.imgProduct[0].img,
      discount: data.discount
    }
    addItemCart(convertData)
  }
  return <section className="text-zinc-900">
    <div className="container mx-auto px-4">
      {data && data.map((d: any) => <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16" key={`detail-${d.idProduct}`}>
        <div className="lg:col-span-3 lg:row-end-1 flex items-center justify-center">
          <div className="flex flex-col">
            <div className="w-full h-3/5">
              {/* current images */}
              <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                <img className="size-4/5 min-h-[400px] max-h-[400px] object-contain" src={currentImage} alt="" />
              </div>
            </div>

            <div className="mt-2 w-full">
              {/* Sub images */}
              <div className="flex flex-row items-center justify-evenly">
                {d.imgProduct.map((i: { img: string, type: string }) =>
                  <button
                    key={i.img}
                    onClick={() => { setCurrentImage(i.img) }}
                    className={`flex-0 aspect-square mx-3 size-28 overflow-hidden rounded-lg border-2 hover:border-blue-500 ${currentImage === i.img ? "border-blue-500" : "border-gray-300"} transition-all text-center`}>
                    <img className="h-full w-full object-contain" src={i.img} alt="" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
          {/* Product Name */}
          <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">{d.nameProduct}</h1>
          {/* Detail product */}
          <div className="detail-product w-full h-auto flex flex-wrap justify-start items-center">
            {d.detail.map((d: any, i: number) => <div
              onClick={() => { setOption(i + 1) }}
              className="w-[200px] h-auto bg-zinc-50 rounded-md p-2 mx-2 cursor-pointer"
              key={`detail-info-${i}`}>
              <Code className="bg-zinc-950 text-zinc-50">Option {i + 1}</Code>
              {i + 1 === option && <Code radius="sm" className="mx-1 bg-blue-500 text-zinc-50">Default</Code>}
              {column?.map((k: any) => <Code radius="sm" className="w-full h-[25px] flex text-zinc-900 truncate my-1" key={k.id}>
                <span className="truncate">{k.displayname.toUpperCase()}: {k.datatypes === "number" ? d[k.name].toFixed(2) : d[k.name]}</span>
              </Code>)}
            </div>)}
          </div>
          {/* Price product  */}
          <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
            <div className="flex items-end">
              <h1 className="text-3xl font-bold">${d.price}</h1>
            </div>
            {/* Button add to cart */}
            {d.action === "show" && <button onClick={() => handleAddCart(data[0])} type="button" className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to cart
            </button>}
          </div>

          <ul className="mt-8 space-y-2">
            <li className="flex items-center text-left text-sm font-medium text-gray-600">
              <svg className="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className=""></path>
              </svg>
              Free shipping worldwide
            </li>

            <li className="flex items-center text-left text-sm font-medium text-gray-600">
              <svg className="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" className=""></path>
              </svg>
              Cancel Anytime
            </li>
          </ul>
          <CommentProduct idProduct={Number(idProduct)} />
        </div>
        {/* Description product */}
        <div className="lg:col-span-3">
          <div className="border-b border-gray-300">
            <nav className="flex gap-4">
              <p className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 cursor-pointer"> Description </p>
            </nav>
          </div>

          <div className="mt-8 flow-root sm:mt-12">
            <p className="mt-4">{d.des}</p>
          </div>
        </div>
        {/* Description product */}
      </div>)}
    </div>
  </section>

}

export default UiDetail
import { useContext, useEffect, useState } from "react"
import { useFetchDataByKey } from "../../../hooks/useFetchData"
import { Button, Code, ModalBody, ModalContent, ModalFooter } from "@nextui-org/react"
import { StateContext } from "../../../context/state"

const ModalDetail = ({id,nameType,setModalName}:{id:number|string,nameType:number|string,setModalName:React.Dispatch<React.SetStateAction<string>>}) => {
  const {data} = useFetchDataByKey('product','productGetDetail',{nameType:nameType,idProduct:id})
  const { data:col } = useFetchDataByKey('product', 'getColByType', nameType)
  const {isDark} = useContext(StateContext)
  const [detailData,setDetailData] = useState<any[] | null>(null)
  const [currentImage, setCurrentImage] = useState("")
  const [column,setColumn] = useState<any[] | null>(null);
  useEffect(() => {
    data && setDetailData(data.data)
    data && setCurrentImage(data.data[0].imgProduct[0].img)
    col && setColumn(col.data)
  },[data,col])
  return <ModalContent>
  {(onClose) => (
    <>
      <ModalBody 
      className={`w-full h-screen overflow-y-auto ${isDark ? "text-zinc-50" : "text-zinc-950"}`}>
      <div className="container mx-auto px-4">
      {detailData && detailData.map((d: any) => <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16" key={`detail-${d.idProduct}`}>
        <div className="lg:col-span-3 lg:row-end-1">
          <div className="lg:flex lg:items-start">
            <div className="lg:order-2 lg:ml-5">
              {/* current images */}
              <div className="overflow-hidden rounded-lg">
                <img className="h-full w-full max-w-full object-cover" src={currentImage} alt="" />
              </div>
            </div>

            <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
              {/* Sub images */}
              <div className="flex flex-row items-start lg:flex-col justify-center">
                {d.imgProduct.map((i: { img: string, type: string }) =>
                  <button
                    key={i.img}
                    onClick={() => { setCurrentImage(i.img) }}
                    className={`flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 hover:border-blue-500 ${currentImage === i.img ? "border-blue-500" : "border-gray-300"} transition-all text-center`}>
                    <img className="h-full w-full object-contain" src={i.img} alt="" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
          {/* Product Name */}
          <h1 className={`text-2xl font-bold sm:text-3xl ${isDark?"text-zinc-50":"text-zinc-950"}`}>{d.nameProduct}</h1>
          {/* Detail product */}
          <div className="detail-product w-full h-auto flex flex-wrap justify-start items-center">
            {d.detail.map((d: any, i: number) => <div 
            className="w-[200px] h-auto rounded-md p-2 mx-2 cursor-pointer" 
            key={`detail-info-${i}`}>
              <Code className="bg-zinc-950 text-zinc-50">Option {i + 1}</Code>
              
              {column?.map((k: any) => <Code radius="sm"  className={`w-full h-[25px] flex ${isDark ? "text-zinc-50" : "text-zinc-950"} truncate my-1`} key={k.id}>
                <span className="truncate">{k.displayname.toUpperCase()}: {k.datatypes === "number" ? d[k.name].toFixed(2): d[k.name]}</span>
              </Code>)}
            </div>)}
          </div>
          {/* Price product  */}
          <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
            <div className="flex items-end">
              <h1 className="text-3xl font-bold">${d.price}</h1>
            </div>
            {/* Button add to cart */}
          </div>
        </div>
        {/* Description product */}
        <div className="lg:col-span-3">
          <div className="mt-8 flow-root sm:mt-12">
            <p className="mt-4">{d.des}</p>
          </div>
        </div>
        {/* Description product */}
      </div>)}
    </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={() => { setModalName && setModalName(""); onClose() }}>
          Close
        </Button>
      </ModalFooter>
    </>
  )}
</ModalContent>
}

export default ModalDetail
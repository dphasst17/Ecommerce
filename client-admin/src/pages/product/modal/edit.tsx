import { useContext, useEffect, useState } from "react"
import { useFetchDataByKey } from "../../../hooks/useFetchData"
import { Badge, Button, Code, Input, ModalBody, ModalContent, ModalFooter, Textarea, Tooltip } from "@nextui-org/react"
import fileUpload from "../../../assets/fileUpload.png"
import { StateContext } from "../../../context/state"
import { RxUpdate } from "react-icons/rx";
import { useForm } from "react-hook-form";
import { createImage, imageUpdate, productUpdate } from "../../../api/product";
import { GetToken } from "../../../utils/token";
import { toast } from "react-toastify";
import { uploadImageProductToS3 } from "../../../api/image"
import { productStore } from "../../../store/product"
interface ObjectKeys {
  [key: string]: string | number | undefined;
}

interface ProductEditType extends ObjectKeys {
  nameProduct: string,
  price: number,
  des: string,
  brand: string
}
const ModalEdit = ({ id, nameType, setModalName }: { id: number | string, nameType: number | string, setModalName: React.Dispatch<React.SetStateAction<string>> }) => {
  const { data } = useFetchDataByKey('product', 'productGetDetail', { nameType: nameType, idProduct: id })
  const { data: col } = useFetchDataByKey('product', 'getColByType', nameType)
  const { register: regisInfo, handleSubmit: submitInfo } = useForm()
  const { register: regisDetail, handleSubmit: submitDetail } = useForm()
  const { product, setProduct } = productStore()
  const { isDark, } = useContext(StateContext)
  const [detailData, setDetailData] = useState<any[] | null>(null)
  const [column, setColumn] = useState<any[] | null>(null);
  const [addImg, setAddImg] = useState<boolean>(false);
  const [newImg, setNewImg] = useState<File[]>([])
  useEffect(() => {
    data && setDetailData(data.data)
    col && setColumn(col.data)
  }, [data, col])

  const onSubmitInfo = async (data: ObjectKeys) => {
    const formatData: ObjectKeys = { ...data, price: Number(data.price) }
    const currentData = detailData?.map((e: ProductEditType) => ({
      nameProduct: e.nameProduct,
      price: e.price,
      brand: e.brand,
      des: e.des
    }))
    const keys = ["nameProduct", "price", "brand", "des"] as const;
    const changedKeys = currentData && keys.filter((key) => {
      return currentData[0][key] !== formatData[key];
    });
    const dataUpdate = currentData && changedKeys?.reduce((k: any, key: string) => {
      return { ...k, [key]: formatData[key] }
    }, {})
    const table = "products"
    const condition = {
      name: "idProduct",
      value: Number(id)
    }
    const token = await GetToken()
    token && changedKeys && changedKeys.length !== 0 && productUpdate(token, { tableName: table, condition: condition, data_update: [dataUpdate] })
      .then(res => {
        if (res.status !== 200) {
          return console.log(res.message)
        }
        res.status === 200 ? toast.success(res.message) : toast.error(res.message)
        product && setProduct({
          ...product,
          data: product.data.map((p: any) => p.idProduct === id ? { ...p, ...dataUpdate } : { ...p })
        })
      })
  }
  const onSubmitDetail = async (data: ObjectKeys) => {
    const { id, ...d } = data
    const table = detailData && detailData[0].nameType
    const currentData = detailData && detailData[0].detail.filter((d: any) => d.id === Number(data.id))

    const changedKeys = (Object.keys(d)).filter((key: string) => {
      return (typeof (currentData[0][key]) === "number" ? Number(currentData[0][key].toFixed(1)) : currentData[0][key])
        !== (typeof (currentData[0][key]) === "number" ? Number(d[key]) : d[key]);
    });
    const dataUpdate = changedKeys.reduce((k: any, key: string) => {
      return { ...k, [key]: (typeof (currentData[0][key]) === "number" ? Number(d[key]) : d[key]) }
    }, {})
    const condition = {
      name: "id",
      value: Number(id)
    }
    const token = await GetToken()
    token && changedKeys.length !== 0 && productUpdate(token, { tableName: table, condition: condition, data_update: [dataUpdate] })
      .then(res => res.status === 200 ? alert(res.message) : console.log(res.message))
  }
  const handleChangeSubImages = (e: any) => {
    const files = Array.from(e.target.files) as File[]
    newImg.length === 0 ? setNewImg(files) : setNewImg(prevFile => [...prevFile, ...files])
  }
  const handleSetDefaultImage = async (img: string) => {
    const currentDefault = detailData?.flatMap((d: any) => {
      return d.imgProduct.filter((i: any) => i.type === "default")[0]
    })
    const dataUpdate = {
      urlDefault: img,
      url: currentDefault?.[0].img,
      type: "update",
      idProduct: Number(id)
    }
    const token = await GetToken()
    token && imageUpdate(token, dataUpdate)
      .then(res => {
        if (res.status === 200) {
          toast.success(res.message)
          product && setProduct({
            ...product,
            data: product.data.map((d: any) => {
              return d.idProduct === Number(id) ? { ...d, imgProduct: img } : d
            })
          })
          const updateDetail = detailData?.flatMap((d: any) => {
            return d.imgProduct.map((i: any) => {
              return {
                ...i,
                type: i.img === img ? "default" : "extra"
              }
            })
          })
          console.log(detailData)
          console.log(updateDetail)
          detailData && setDetailData(detailData.map((d: any) => ({
            ...d,
            imgProduct: updateDetail?.sort((a: any, __b: any) => a.type === "default" ? -1 : 1)
          })))
        }
        else {
          toast.error(res.message)
        }
      })
  }
  const uploadImages = async () => {
    if (newImg.length === 0) {
      setAddImg(false)
      return
    }
    const s3Image = new FormData()
    for (let i = 0; i < newImg.length; i++) {
      s3Image.append(`file${[i]}`, newImg[i])
    }
    const dataInsert = newImg.map((i: File) => {
      return {
        type: "extra",
        idProduct: Number(id),
        img: `${import.meta.env.VITE_REACT_APP_URL_IMG}/product/${i.name}`
      }
    })
    const token = await GetToken()
    uploadImageProductToS3(s3Image)
      .then((res) => {
        console.log(res)
      })
      .catch((err: any) => console.log(err))
    token && createImage(dataInsert, token)
      .then(res => {
        if (res.status === 201) {
          toast.success(res.message)
          setAddImg(false)
          setNewImg([])
          detailData && setDetailData(detailData.map((d: any) => ({ ...d, imgProduct: [...detailData[0].imgProduct, ...dataInsert] })))
        } else {
          toast.error(res.message)
        }
      })
  }
  const handleDeleteImage = async (img: string) => {
    const dataDelete = {
      urlDefault: img,
      type: "delete",
    }
    const token = await GetToken()
    token && imageUpdate(token, dataDelete)
      .then(res => {
        if (res.status === 200) {
          toast.success(res.message)
          detailData && setDetailData(detailData?.flatMap((d: any) => {
            return {
              ...d,
              imgProduct: d.imgProduct.filter((i: any) => i.img !== img)
            }
          }))
        }
        else {
          toast.error(res.message)
        }
      })
  }
  return <ModalContent>
    {(onClose) => (
      <>
        <ModalBody key="Modal-edit"
          className={`w-full h-screen overflow-y-auto ${isDark ? "text-zinc-50" : "text-zinc-950"}`}>
          <div className="container mx-auto px-4">
            {detailData && detailData.map((d: any) => <div className="w-full flex flex-wrap justify-around items-center" key={`detail-${d.idProduct}`}>
              <div className="w-full my-4 flex flex-wrap">
                <Button onClick={() => setAddImg(!addImg)} size="sm" color="primary">Add new images</Button>
                {addImg && <>
                  <Button onClick={uploadImages} color="success" size="sm" className="mx-1 text-white">Upload</Button>
                  <Button onClick={() => { setAddImg(!addImg), setNewImg([]) }} color="danger" size="sm" className="mx-1">Close</Button>
                  <div className="w-full my-2">
                    <label htmlFor="dropzone-file-sub" className={`flex flex-col items-center justify-center w-4/5 mx-auto h-40 border-2 
                  border-dashed rounded-lg cursor-pointer bg-gray-700 `}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <img className="w-10 h-10" src={fileUpload} alt="img File upload" />
                        {newImg.length !== 0 && <span className="text-sm text-gray-500 dark:text-white my-2">{newImg?.flatMap((f: any) => f.name).toString()}</span>}
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Sub image</span></p>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input id="dropzone-file-sub" type="file" className="hidden" multiple
                        onChange={handleChangeSubImages} />
                    </label>
                  </div>

                  <div className="w-[95%]">
                    <h3>Images Preview:</h3>
                    <div className="w-full grid grid-cols-2 gap-2">
                      {newImg.map((imgFile, index) =>
                        <div className="relative">
                          <Button isIconOnly onClick={() => setNewImg(newImg.filter((_, i) => i !== index))} className="absolute top-1 right-1" color="danger" size="sm">X</Button>
                          <img
                            key={index}
                            src={URL.createObjectURL(imgFile)}
                            alt={`Preview ${index + 1}`}
                            className="h-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>}
              </div>
              <div className="w-full h-1/4 xl:h-full flex flex-wrap justify-around">
                {/* Product Name */}
                <div className="w-full grid grid-cols-4 gap-4 mb-8">
                  {d.imgProduct.map((i: { img: string, type: string }) =>
                    <div className="relative">
                      {i.type !== 'default' && <Button isIconOnly onClick={() => handleDeleteImage(i.img)} className="absolute top-1 right-1" color="danger" size="sm">X</Button>}
                      {
                        i.type === "default" ? <Badge content="Default" color="primary" placement="top-left" >
                          <img className="h-full w-full object-contain cursor-pointer" src={i.img} alt="" />
                        </Badge>
                          : <Tooltip color="foreground" content="Click to set default or remove">
                            <img onClick={() => handleSetDefaultImage(i.img)} className="h-full w-full object-contain cursor-pointer" src={i.img} alt="" />
                          </Tooltip>
                      }
                    </div>

                  )}
                </div>
                <Input {...regisInfo('nameProduct', { required: true })} label="Name Product" defaultValue={d.nameProduct} className={`w-2/4 text-2xl font-bold sm:text-3xl ${isDark ? "text-zinc-50" : "text-zinc-950"} my-1`} />
                <Input {...regisInfo('price', { required: true })} label="Price" type="text" defaultValue={d.price} className="w-[15%] my-1" />
                <Input {...regisInfo('total', { required: true })} label="Total" type="text" defaultValue={d.total} className="w-[15%] my-1" />
                <Input {...regisInfo('brand', { required: true })} label="Brand" type="text" defaultValue={d.brand} className="w-[15%] my-1" />
                <Textarea
                  {...regisInfo('des')}
                  labelPlacement="outside"
                  placeholder="Enter your description"
                  defaultValue={d.des}
                  className="w-[99%] my-1"
                />
                <Button color="danger" onClick={() => submitInfo(onSubmitInfo)()}>Update</Button>
              </div>
              <div className="detail-product w-full h-auto flex flex-wrap justify-start items-center">
                {d.detail.map((d: any, i: number) => <div
                  className="xl:w-[49%] h-auto rounded-md p-2 cursor-pointer"
                  key={`detail-info-${d.id}`}>
                  <Code className="bg-zinc-950 text-zinc-50">Option {i + 1}</Code>
                  <Button color="danger" isIconOnly size="sm" className="mx-1" onClick={() => submitDetail(onSubmitDetail)()}>
                    <RxUpdate />
                  </Button>
                  <Input {...regisDetail('id')} type="number" value={d.id} />
                  {column?.map((k: any) =>
                    <Input {...regisDetail(`${k.name}`)} radius="sm" className="my-1" type={typeof (d[k.name]) === "number" ? "number" : "text"}
                      defaultValue={typeof (d[k.name]) === "number" ? (d[k.name]).toFixed(1) : d[k.name]} key={`${d.id}-${k.name}`} />
                  )}

                </div>)}
              </div>
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

export default ModalEdit
import { Button, Modal, useDisclosure } from "@nextui-org/react"
import { LiaLaptopMedicalSolid } from "react-icons/lia";
import { TbCategoryPlus } from "react-icons/tb";
import { useState } from "react";
import AddProduct from "./modal/add_product";
import AddCategory from "./modal/add_category";
const BtnList = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalName, setModalName] = useState("")
    const listModal = [
        {
            displayName: "product",
            modalDetail: AddProduct
        },
        {
            displayName: "category",
            modalDetail: AddCategory
        }
    ]
    return <div className="w-full flex flex-wrap items-center pl-4 my-2">
        <Button onClick={() => { onOpen(); setModalName("product") }} isIconOnly color="primary" size="sm" className="mx-1">
            <LiaLaptopMedicalSolid className="text-[20px] text-zinc-50" />
        </Button>
        <Button onClick={() => { onOpen(); setModalName("category") }} isIconOnly color="primary" size="sm" className="mx-1">
            <TbCategoryPlus className="text-[20px] text-zinc-50" />
        </Button>
        <Modal
            isOpen={isOpen}
            onOpenChange={() => { onOpenChange(); setModalName("") }}
            backdrop="opaque"
            placement="center"
            size="5xl"
            className="h-full xl:h-[90%]"
            classNames={{ wrapper: "overflow-hidden" }}
        >
            {listModal.filter((f: any) => f.displayName === modalName).map((m: any) =>
                <m.modalDetail setModalName={setModalName} key={`Modal-${m.displayName}`} />
            )}
        </Modal>
    </div>
}

export default BtnList
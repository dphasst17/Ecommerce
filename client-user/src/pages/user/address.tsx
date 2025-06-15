import { Button, Code, Modal, useDisclosure } from "@nextui-org/react";
import { userStore } from "../../store/user";
import { GetToken } from "../../utils/token";
import { userAddress } from "../../api/user";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEditLocationAlt } from "react-icons/md";
import ModalAddress from "./modal/address";
import { useState } from "react";
import ModalEditAddress from "./modal/address.edit";
import { toast } from "react-toastify"
const Address = () => {
  const { user, remove_address, updated_address } = userStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalName, setModalName] = useState<string | null>(null)
  const [dataEdit, setDataEdit] = useState<string>("")
  const [selectedId, setSelectedId] = useState<number>(0)

  const handleChangeAddress = async (type: "update" | "remove", data: { typeAddress?: string }, id: number) => {
    const token = await GetToken();
    const dataChange = {
      type: type,
      dataOperation: data,
      id: id
    };
    token &&
      userAddress(token, dataChange).then((res) => {
        if (res.status === 200) {
          type === "update" ? toast.success(res.message) : toast.success("Remove address is success");
          type === "remove" ? remove_address(id) : updated_address({ ...data, id: id });
        }
      });
  };
  return <div className="w-full">
    <Button onClick={() => { setModalName("add"); onOpen() }} className="w-[220px] text-[18px] bg-[#0E1422] text-[#FFFFFF]" radius="sm">Add Address</Button>
    <div className="address w-full h-full text-zinc-900 mt-10">
      {user &&
        user[0]?.address.map((a: any) => (
          <div className="address-detail w-[98%] my-2 !text-zic-100 flex flex-wrap" key={a.idAddress}>
            <Code
              radius="sm"
              className={`flex items-center ${a.type === "default" ? "bg-blue-500 text-white" : "bg-white shadow-lg text-black"
                } w-[99%] md:w-4/5 min-h-[45px] text-[18px] cursor-pointer my-1`}
            >
              <span className="truncate">{a.detail}</span>
            </Code>
            <Button
              size="sm"
              radius="sm"
              className={`w-[120px] h-[45px] text-[18px] flex items-center  text-center ${a.type === "extra" ? "bg-white shadow-lg text-black" : "bg-blue-500 text-white"
                }  m-1 cursor-pointer`}
              onClick={() => {
                handleChangeAddress("update", {
                  typeAddress: a.type === "default" ? "extra" : "default",
                }, a.idAddress);
              }}
            >
              {a.type}
            </Button>
            <Button
              isIconOnly
              size="sm"
              radius="sm"
              className="h-[45px] text-[18px] bg-blue-500 m-1"
              onClick={() => { setSelectedId(a.idAddress), setDataEdit(a.detail); setModalName("edit"); onOpen() }}
            >
              <MdEditLocationAlt className="text-white" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              radius="sm"
              color="danger"
              className="h-[45px] text-[18px] m-1"
              onClick={() => handleChangeAddress("remove", {}, a.idAddress)}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        ))}
    </div>
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      backdrop="opaque"
      placement="center"
    >
      {modalName && modalName === "add" && <ModalAddress />}
      {modalName && modalName === "edit" && <ModalEditAddress address={dataEdit} idAddress={selectedId} />}
    </Modal>
  </div>
};

export default Address;

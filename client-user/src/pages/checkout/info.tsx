import { Button, Input, Modal, useDisclosure } from "@nextui-org/react";
import { StateContext } from "../../context/stateContext";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CartType,
  OrderInsertType,
  UserAddressType,
  UserType,
} from "../../types/type";
import { FaEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import ModalEditAddress from "./modalEditAddress";
import { CartContext } from "../../context/cartContext";
import PaymentPaypal from "./paypal";
import ModalAddress from "../../pages/user/modal/address";
import { GetToken } from "../../utils/token";
import { orderInsert } from "../../api/order";
import { userStore } from "../../store/user";
import ModalCheckOutSuccess from "./modalCheckOutSuccess";
interface FormInfo {
  nameUser: string;
  phone: string;
  address: string;
}
interface Method {
  id: string;
  content: string;
  costs?: number;
  date?: string;
}

const arrClassNameInput = [
  "shadow-lg border-zinc-900 hover:border-blue-500 transition-all",
];

const getNextDay = (currentDate: Date, daysToAdd: number) => {
  const nextDate = new Date(currentDate);

  // Tăng ngày lên số ngày muốn thêm
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  return nextDate;
};

const InfoCheckout = () => {
  const { cart } = useContext(CartContext);
  const { listCheckOut, order, setOrder } = useContext(StateContext);
  const { user } = userStore();
  const { register, handleSubmit } = useForm<FormInfo>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<any[] | []>([]);
  const [currentAddress, setCurrentAddress] = useState("");
  const [cost, setCost] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetail, setPaymentDetail] = useState<any[] | null>(null);
  const [isPayment, setIsPayment] = useState<boolean>(false);
  const { isOpen: isOpenStatus, onOpen: onOpenStatus, onOpenChange: onOpenChangeStatus } = useDisclosure();
  useEffect(() => {
    user && user[0].address.length !== 0
      ? setCurrentAddress(
        user.flatMap(
          (u: UserType) =>
            u.address.filter((a: UserAddressType) => a.type === "default")[0],
        )[0].detail,
      )
      : setCurrentAddress("");
  }, [user]);

  useEffect(() => {
    cart &&
      setData(cart.filter((c: CartType) => listCheckOut.includes(c.idCart)));
  }, [cart, listCheckOut]);
  const arrShippingMethod: Method[] = [
    {
      id: "shipping-1",
      content: "Express shipping",
      costs: 0.85,
      date: "2-4",
    },
    {
      id: "shipping-2",
      content: "Economical shipping",
      costs: 0.5,
      date: "5-10",
    },
  ];
  const arrPaymentMethod: Method[] = [
    {
      id: "payment-1",
      content: "Payment on delivery",
    },
    {
      id: "payment-2",
      content: "Payment with Paypal",
    },
  ];
  const onSubmit = async (formData: FormInfo) => {
    const currentDate = new Date();
    const eddDate = getNextDay(currentDate, 12);
    const token = await GetToken();
    const dataOrder: OrderInsertType = {
      order: [
        {
          fullName: formData.nameUser,
          phone: formData.phone,
          address: formData.address,
          costs: cost,
          method: paymentMethod,
          edd: eddDate.toISOString().split("T")[0],
          paymentStatus: paymentDetail ? "paid" : "unpaid",
        },
      ],
      listId: listCheckOut,
    };
    token &&
      (orderInsert(token, dataOrder).then((res) => {
        if (res.status === 201) {
          onOpenStatus()
          const dataAppend = [...Array(res.data.detail.length)].map((_, i) => {
            const dataProduct = data.filter((f: any) => f.idCart === listCheckOut[i])
            return {
              idOrdDetail: res.data.detail.firstId + i,
              idOrder: res.data.idOrder,
              idProduct: listCheckOut[i],
              nameProduct: dataProduct[0].detail[0].nameProduct,
              imgProduct: dataProduct[0].detail[0].imgProduct,
              countProduct: dataProduct[0].countProduct,
              price: dataProduct[0].detail[0].price,
              discount: dataProduct[0].detail[0].discount,
              orderStatus: 'pending',
              paymentStatus: paymentDetail ? "paid" : "unpaid",
            }
          })
          setOrder([...order, ...dataAppend])
        }
      }));
  };
  return (
    <>
      <div className="info-checkout w-[95%] sm:w-4/5 md:w-2/5 lg:w-[30%] h-full flex flex-col items-center">
        {user &&
          user.map((u: UserType) => (
            <form
              key={`form-checkout-${u.idUser}`}
              className="w-full flex flex-wrap justify-between items-center"
            >
              <Input
                {...register("nameUser", { required: true })}
                type="text"
                variant="faded"
                label="Name"
                size="sm"
                radius="sm"
                className="my-2 text-zinc-950"
                classNames={{ inputWrapper: arrClassNameInput }}
                defaultValue={u.nameUser}
              />
              <Input
                {...register("phone", { required: true })}
                type="text"
                variant="faded"
                label="Phone"
                size="sm"
                radius="sm"
                className="my-2 text-zinc-950"
                classNames={{ inputWrapper: arrClassNameInput }}
                defaultValue={u.phone}
              />
              <Input
                {...register("address", { required: true })}
                isReadOnly
                type="text"
                variant="faded"
                label="Address"
                size="sm"
                radius="sm"
                classNames={{ inputWrapper: arrClassNameInput }}
                className="w-[90%] truncate pr-2 my-2 text-zinc-950"
                value={currentAddress}
              />
              <Button
                isIconOnly
                size="sm"
                radius="sm"
                color="primary"
                className="flex items-center justify-center"
                onPress={onOpen}
              >
                {user && user[0].address.length !== 0 ? <FaEdit /> : <IoMdAdd />}
              </Button>
            </form>
          ))}
        <div className="method-checkout w-full my-1 rounded-md text-zinc-950 p-1">

          <div className="w-[95%] flex justify-between my-1">
            Count:
            <span>
              {data.length !== 0
                ? data
                  .map((d: CartType) => d.countProduct)
                  .reduce((a: number, b: number) => a + b)
                : 0}
            </span>
          </div>
          <div className="w-[95%] flex justify-between my-1">
            Total price:{" "}
            <span>
              ${data.length !== 0
                ? data
                  .map(
                    (d: any) =>
                      d.countProduct * d.detail[0].price -
                      (d.detail[0].price *
                        d.countProduct *
                        d.detail[0].discount) /
                      100,
                  )
                  .reduce((a: number, b: number) => a + b)
                  .toFixed(2)
                : 0}
            </span>
          </div>
          {/* Shipping method */}
          <h2>Shipping method</h2>
          <div className="w-full flex justify-around mb-3">
            {arrShippingMethod.map((s: Method) => (
              <div
                key={s.id}
                onClick={() => {
                  setCost(s.costs!);
                }}
                className={`shipping-box shadow-lg ${cost === s.costs ? "bg-blue-600 text-white" : "bg-transparent"} flex flex-col justify-center items-center w-[45%] h-auto min-h-[80px] rounded-md hover:bg-blue-600 hover:text-white border border-solid border-zinc-200 cursor-pointer transition-all`}
              >
                <span>{s.content}</span>
                <span>Cost: {s.costs}$</span>
                <span>Delivery time: {s.date} day</span>
              </div>
            ))}
          </div>
          <h2>Payment method</h2>
          <div className="w-full flex justify-around mb-2">
            {arrPaymentMethod.map((m: Method) => (
              <div
                key={m.id}
                onClick={() => {
                  setIsPayment(m.id === "payment-1" ? true : false);
                  cost !== 0
                    ? setPaymentMethod(m.content)
                    : alert("Select shipping method!");
                }}
                className={`payment-box shadow-lg flex justify-center items-center w-[45%] ${paymentMethod === m.content ? "bg-blue-600 text-white" : "bg-transparent"}  hover:bg-blue-600 hover:text-white border border-solid border-zinc-100 rounded-md cursor-pointer transition-all`}
              >
                {m.content}
              </div>
            ))}
          </div>
          {/* Payment method */}
          {paymentMethod === "Payment with Paypal" && (
            <PaymentPaypal
              dataItem={data}
              cost={cost}
              setIsPayment={setIsPayment}
              setPaymentDetail={setPaymentDetail}
            />
          )}
        </div>
        {isPayment && (
          <Button
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            color="success"
            size="sm"
            radius="sm"
            className="w-2/5 text-white font-semibold text-[20px]"
          >
            Order
          </Button>
        )}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="lg"
          backdrop="opaque"
          placement="center"
        >
          {user && user[0].address.length !== 0 ? (
            <ModalEditAddress
              currentAddress={currentAddress}
              setCurrentAddress={setCurrentAddress}
            />
          ) : (
            <ModalAddress />
          )}
        </Modal>
      </div>
      <Modal isOpen={isOpenStatus} onOpenChange={onOpenChangeStatus} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalCheckOutSuccess />
      </Modal>
    </>
  );
};

export default InfoCheckout;

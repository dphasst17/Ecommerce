import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CartType } from "../../types/type";
interface Payment {
    dataItem: CartType[],
    cost: number,
    setIsPayment:React.Dispatch<React.SetStateAction<boolean>>,
    setPaymentDetail: React.Dispatch<React.SetStateAction<any[] | null>>
}
const PaymentPaypal = ({ dataItem, cost, setIsPayment,setPaymentDetail }: Payment) => {
    const handleApprove = (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
            console.log(details)
            const paymentDetailData = {
                payment_name:'paypal',
                payment_id:details.id,
                total_price:details.purchase_units[0].amount.value,
                currency_code:details.purchase_units[0].amount.currency_code
            }
            setPaymentDetail([paymentDetailData])
            setIsPayment(true)
        });
    };
    return <div className="w-[300px] mx-auto my-2 z-30">
        <PayPalScriptProvider options={{ "clientId": `${import.meta.env.VITE_REACT_APP_PAYPAL}` }}>
            <PayPalButtons
                className="!z-40"
                createOrder={async (data, actions) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            description: 'LIST PRODUCT', // Mô tả đơn hàng
                            amount: {
                                value: `${(dataItem.map((d: CartType) => (d.countProduct * (d.detail[0].price - (d.detail[0].price * d.detail[0].discount / 100)))).reduce((a: number, b: number) => a + b) + cost).toFixed(2)}`, // Tổng giá + phí ship
                                currency_code: 'USD',
                                breakdown: {
                                    item_total: {
                                        currency_code: 'USD',
                                        value: `${dataItem.map((d: CartType) => (d.countProduct * (d.detail[0].price - (d.detail[0].price * d.detail[0].discount / 100)))).reduce((a: number, b: number) => a + b).toFixed(2)}` //Tổng giá
                                    },
                                    shipping: {
                                        currency_code: 'USD',
                                        value: cost ? cost.toString() : '0' // Phí ship
                                    }
                                }
                            },
                            items: dataItem && dataItem.map((e: CartType) => {
                                return {
                                    name: e.detail[0].nameProduct.toUpperCase(),
                                    quantity: e.countProduct.toString(),
                                    unit_amount: {
                                        currency_code: 'USD',
                                        value: (e.detail[0].price - (e.detail[0].price * e.detail[0].discount / 100)).toFixed(2), // Giá của mỗi sản phẩm sau khi đã trừ discount
                                    }
                                }
                            })
                        }]
                    });
                }}
                onApprove={handleApprove}
            />


        </PayPalScriptProvider>
    </div>
}

export default PaymentPaypal
import { StateContext } from "../../context/stateContext"
import { CartContext } from "../../context/cartContext"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CartType } from "../../types/type"
import Product_layout_02 from "../../components/product/layout_02"

const ListItem = () => {
  const { cart } = useContext(CartContext)
  const { listCheckOut } = useContext(StateContext)
  const navigate = useNavigate()
  useEffect(() => {
    listCheckOut.length === 0 && navigate('/cart')
  }, [listCheckOut])
  return <div className="listItem-checkout w-full sm:w-4/5 md:w-2/5 lg:w-3/5 h-full flex flex-wrap justify-between content-start">
    {
      cart && cart.filter((c: CartType) => listCheckOut.includes(c.idCart))
        .map((c: CartType) => <div
          className={`relative w-[95%] lg:w-[48%] rounded-md  text-zinc-700 my-1 cursor-pointer`}
          key={`checkout-${c.idCart}`}>
          <Product_layout_02 data={c} isButton={false} />
        </div>
        )
    }
  </div>
}

export default ListItem
import InfoCheckout from "./info"
import ListItem from "./listItem"

const Checkout = () => {
  return <div className='checkout w-full h-auto xl:h-screen flex flex-wrap justify-around items-center'>
    <ListItem />
    <InfoCheckout />
  </div>
}

export default Checkout
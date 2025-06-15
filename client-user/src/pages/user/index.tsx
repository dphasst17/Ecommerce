import { useState } from "react"
import Order from "./order";
import { userStore } from "../../store/user";
import Account from "./account";
import Address from "./address";
import Password from "./password";
import { CiUser, CiShoppingCart } from "react-icons/ci";
import { MdOutlineLocalShipping } from "react-icons/md";
import { TfiKey } from "react-icons/tfi";

const User = () => {
  const { user } = userStore()
  const [activeComponent, setActiveComponent] = useState("Account")
  const componentList = [
    {
      displayName: "Account",
      component: Account,
      icon: CiUser
    },
    {
      displayName: "Order",
      component: Order,
      icon: CiShoppingCart
    },
    {
      displayName: "Address",
      component: Address,
      icon: MdOutlineLocalShipping
    },
    {
      displayName: "Password",
      component: Password,
      icon: TfiKey
    }
  ]
  return user && <div className="user w-full h-auto min-h-screen p-2 flex items-center justify-center">
    <div className="user w-[90%] h-auto min-h-[500px] flex flex-wrap justify-around items-center">
      <div className="w-full 2xl:w-1/5 h-auto min-h-[100px] 2x:h-[500px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-1 2xl:border-r 2x:border-r-solid 2xl:border-zinc-900 py-10">
        {componentList.map((c: any) => <div
          onClick={() => setActiveComponent(c.displayName)}
          className={`h-[45px] p-4 flex items-center font-bold text-[20px] rounded-md  my-1 mx-1
        ${activeComponent === c.displayName ? 'bg-[#0E1422] text-zinc-100' : 'text-zinc-500'} 
        hover:bg-[#0E1422] hover:text-zinc-100 transition-all cursor-pointer`}>
          <c.icon className="mr-2" /> {c.displayName}
        </div>)}
      </div>
      <div className="w-[99%] 2xl:w-[70%] h-auto min-h-[500px]">
        {componentList.filter((c: any) => c.displayName === activeComponent).map((c: any) => <c.component />)}
      </div>
    </div>
  </div>
}

export default User
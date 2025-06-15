import logo from "../assets/Logomark.png"
import CartIcon from "../components/icon/cart";
import UserIcon from "../components/icon/user";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react"
import { useLocation, useNavigate } from "react-router-dom"
import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { GiLaptop } from "react-icons/gi";
import { FaRegNewspaper, FaBars, FaRegWindowClose } from "react-icons/fa";
import { MdOutlineContactPhone } from "react-icons/md";
import { useContext, useState } from "react";
import { StateContext } from "../context/stateContext";
import { CartContext } from "../context/cartContext";
import { CartType } from "../types/type";
import Product_layout_02 from "../components/product/layout_02";
import { GetToken, RemoveToken } from "../utils/token";
import { authLogout } from "../api/auth";
import { IconType } from "react-icons";

interface NavType {
  id: number | string,
  name: string,
  url: string,
  icon: IconType
}

const Header = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, setIsLogin, setListCheckOut } = useContext(StateContext)
  const { cart } = useContext(CartContext)
  const [inputSearch, setInputSearch] = useState<string>("");
  const [navMob, setNavMob] = useState<boolean>(false)
  const listNav: NavType[] = [
    {
      id: 1,
      name: 'HOME',
      url: '/',
      icon: AiOutlineHome
    },
    {
      id: 2,
      name: 'PRODUCT',
      url: '/product',
      icon: GiLaptop
    },
    {
      id: 3,
      name: 'POST',
      url: '/post',
      icon: FaRegNewspaper
    },
    {
      id: 4,
      name: 'CONTACT',
      url: '/contact',
      icon: MdOutlineContactPhone
    }
  ]
  const listNavMobile: NavType[] = [
    {
      id: '#mob-nav-1',
      name: 'User',
      url: '/user',
      icon: UserIcon
    },
    {
      id: '#mob-nav-2',
      name: 'Cart',
      url: '/cart',
      icon: CartIcon
    },
  ]
  const handleLogout = async () => {
    const token = await GetToken()
    token && authLogout(token)
      .then(res => {
        if (res.status === 200) {
          setListCheckOut([])
          RemoveToken('u-aTk')
          RemoveToken('u-rTk')
          RemoveToken('u-login')
          setIsLogin(false)
          navigate('/auth')
        }
      })
  }
  const handleNavigate = (url: string) => {
    navigate(url)
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  const handleSearch = () => {
    inputSearch !== "" && (setNavMob(false), navigate(`/search/${inputSearch}`))
  }
  return <header className={`bg-white sticky top-0 w-screen md:w-[99vw] h-auto min-h-[20vh] lg:h-[10vh] lg:min-h-[0vh] flex flex-wrap justify-between sm:justify-around content-around transition-all rounded-md z-50 px-5`}>
    <div className="logo w-4/5 lg:w-1/5 h-[60px] lg:h-3/4 flex items-center justify-start sm:justify-center md:justify-start">
      <img src={logo} width={40} height={30} alt="logo" className="mx-4" />
      <h1 className="text-[15px] sm:text-[20px] xl:text-[30px] font-bold text-[#242424]">TECH STORE</h1>
    </div>
    <div onClick={() => setNavMob(!navMob)} className="btnNav w-1/5 flex lg:hidden justify-center items-center">
      <FaBars className="text-[20px] text-zinc-950" />
    </div>
    {navMob && <div onClick={() => setNavMob(!navMob)} className="nav-mob-overlay top-0 left-0 w-screen h-screen bg-zinc-950 opacity-45 absolute"></div>}
    <nav className={`nav-mob fixed top-1 right-1 z-50 w-[100vw] ssm:w-[70vw] sm:w-[50vw] md:w-[35vw] h-[50vh] rounded-md bg-zinc-50 ${navMob ? 'translate-x-0' : 'translate-x-[100vw]'} transition-all p-1`}>
      <Button isIconOnly color="danger" onClick={() => setNavMob(!navMob)} className="flex justify-center items-center mb-3">
        <FaRegWindowClose className="w-3/5 h-3/5" />
      </Button>
      <div className={`w-full flex sm:hidden justify-around items-center transition-all rounded-lg`}>
        <Input
          onChange={(e) => setInputSearch(e.target.value)}
          onKeyDown={(e: any) => { if (e.key === "Enter") { handleSearch() } }}
          type="search"
          radius="sm"
          variant="bordered"
          className="w-[98%] placeholder-zinc-900 text-zinc-950"
          placeholder="Search products"
          startContent={
            <Button onClick={handleSearch} aria-label="button search" radius="sm" className="bg-transparent" isIconOnly>
              <BiSearchAlt2 className="text-[25px] text-zinc-950" />
            </Button>
          }
        />
      </div>
      {listNavMobile.map((n: NavType) => <div className="w-full h-[50px] flex justify-start items-center my-1 px-2" onClick={() => { handleNavigate(n.url) }} key={n.id}>
        {<n.icon className="text-[20px] text-zinc-50" />} <span className="mx-2 text-zinc-950 text-[20px]">{n.name}</span>
      </div>
      )}
      <Button size="sm" radius="sm" color="danger" onClick={() => isLogin ? handleLogout() : navigate("/auth")}>{isLogin ? "Logout" : "Login"}</Button>
    </nav>
    <nav className={`w-full sm:w-[65%] lg:w-[40%] h-3/4 flex justify-around items-center transition-all rounded-lg`}>
      {listNav.map((n: NavType) => <div
        key={`header-${n.id}`}
        onClick={() => { handleNavigate(n.url) }}
        className={`nav-content w-1/5 h-4/5 flex flex-col items-center content-center justify-evenly  text-zinc-900 hover:font-semibold transition-all rounded-md cursor-pointer
          
        `}
      >
        <span className="block md:hidden">{<n.icon className="text-[25px]" />}</span>
        <span className={`nav-text hidden sm:block
        font-bold
        transition-all 
        bg-clip-text 
        ${location.pathname === n.url ?
            `text-[22px] text-transparent bg-[linear-gradient(to_right,theme(colors.cyan.500),theme(colors.blue.500),theme(colors.teal.500),theme(colors.teal.500),theme(colors.blue.400),theme(colors.cyan.500),theme(colors.indigo.500))]` : " text-zinc-950"}
        text-[20px]
        `}>{n.name}</span>
        <div className={`border-nav ${location.pathname === n.url ? "!opacity-100" : "opacity-0"} w-full h-[2px] bg-gradient-to-r from-cyan-900 to-cyan-500`}></div>
      </div>)}
    </nav>
    {/* Search */}
    <nav className={`w-[35%] h-3/4 hidden sm:flex justify-around items-center transition-all rounded-lg`}>
      <Input
        onChange={(e) => setInputSearch(e.target.value)}
        onKeyDown={(e: any) => { if (e.key === "Enter") { handleSearch() } }}
        type="search"
        radius="sm"
        variant="bordered"
        className="w-4/5 placeholder-zinc-900 text-zinc-950"
        placeholder="Search products"
        startContent={
          <Button onClick={handleSearch} aria-label="button search" radius="sm" className="bg-transparent" isIconOnly>
            <BiSearchAlt2 className="text-[25px] text-zinc-950" />
          </Button>
        }
      />
    </nav>
    <nav className={`w-[5%] h-3/4 hidden lg:flex justify-evenly items-center transition-all rounded-lg`}>
      {isLogin && <Dropdown backdrop="blur" placement="top-end" offset={20} className="relative bg-zinc-100">
        <DropdownTrigger className="fixed">
          <Button radius="sm" isIconOnly className="bg-transparent relative !hidden sm:!flex justify-center" aria-label="button-cart">
            <CartIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu closeOnSelect={false} className="w-[500px] h-auto min-h-[100px] max-h-[450px] !text-zinc-950">
          {cart && cart.slice(0, 4).map((c: CartType) => <DropdownItem key={c.idCart}>
            <Product_layout_02 data={c} isButton={true} />
          </DropdownItem>)}
          {cart && cart.length !== 0 && <DropdownItem className="flex justify-center items-center" variant="light">
            <Button className="mx-auto" onClick={() => { navigate('/cart') }}>Detail</Button>
          </DropdownItem>}
        </DropdownMenu>
      </Dropdown>
      }
      {/* {isLogin && <Button radius="sm" isIconOnly aria-label="button-notification">
        <IoIosNotifications className="w-4/5 h-3/5" />
      </Button>} */}
      <Dropdown placement="top-end" offset={20} className="bg-zinc-700">
        <DropdownTrigger>
          <Button radius="sm" isIconOnly aria-label="button-user" className="bg-transparent">
            <UserIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu closeOnSelect={true}>
          <DropdownItem onClick={() => { isLogin ? navigate('/user') : navigate("/auth") }}>User</DropdownItem>
          <DropdownItem variant="light">
            <Button size="sm" radius="sm" color="danger" onClick={() => isLogin ? handleLogout() : navigate("/auth")}>{isLogin ? "Logout" : "Login"}</Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </nav>
  </header>
}

export default Header
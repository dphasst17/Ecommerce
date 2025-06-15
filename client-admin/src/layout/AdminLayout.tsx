import { ReactNode, useContext, useEffect, useState } from "react";
import { TfiDashboard } from "react-icons/tfi";
import {
  FaLaptopCode,
  FaUserCog,
  FaLuggageCart,
  FaMoon,
  FaSun,
  FaAngleLeft,
  FaAngleRight
} from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { BsFillPostcardFill } from "react-icons/bs";
import {
  MdOutlineDiscount,
  MdOutlineLightMode,
} from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";
import { IconType } from "react-icons";
import { CiSearch } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { Button, Modal, Switch, useDisclosure } from "@nextui-org/react";
import { StateContext } from "../context/state";
import { RemoveToken } from "../utils/token";
import Logo from "../assets/Logomark.png"
import classNames from "classnames";
import CurrentUser from "../pages/account/current";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NavContent {
  idNav: number;
  content: string;
  icon: IconType;
  url: string;
}
const navArr: NavContent[] = [
  {
    idNav: 1,
    content: "Dashboard",
    icon: TfiDashboard,
    url: "/"
  },
  {
    idNav: 2,
    content: "Product",
    icon: FaLaptopCode,
    url: "/product"
  },
  {
    idNav: 3,
    content: "Customer",
    icon: FaUserCog,
    url: "/account"
  },
  {
    idNav: 4,
    content: "Post",
    icon: BsFillPostcardFill,
    url: "/post"
  },
  {
    idNav: 5,
    content: "Order",
    icon: FaLuggageCart,
    url: "/order"
  },
  {
    idNav: 6,
    content: "Event",
    icon: MdOutlineDiscount,
    url: "/event"
  },
  {
    idNav: 7,
    content: "Comment",
    icon: BiSolidCommentDetail,
    url: "/comment"
  }
];

interface IAdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: IAdminLayoutProps) => {
  const { role, position, isDark, setIsDark, setIsLogin, setPosition } = useContext(StateContext);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHeader, setIsHeader] = useState(false)
  const [navResult, setNavResult] = useState<NavContent[] | null>(null)
  useEffect(() => {
    const filterNav = role && role !== 0 ? navArr.filter((item: NavContent) =>
      role === 1 && position !== "shipper" ? item.idNav !== 3 : item.idNav === 5
    ) : navArr
    setNavResult(filterNav)
  }, [role, position])
  const handleSetDarkMode = () => {
    setIsDark(!isDark);
    localStorage.setItem("isDark", JSON.stringify(!isDark));
  };

  const handleLogout = () => {
    setIsLogin(false);
    setPosition(null);
    RemoveToken("aTk");
    RemoveToken("rTk");
    RemoveToken("a-Log");
  };

  return (
    <div className={`relative flex h-screen overflow-y-hidden `}>
      <div className={`overlay absolute ${isHeader ? "block" : "hidden"} top-0 left-0 w-full h-full z-20 bg-zinc-950 bg-opacity-50 transition-all`} onClick={() => setIsHeader(!isHeader)}></div>
      <aside
        className={`fixed z-50 transition-all w-72 pt-6 px-6 pb-8 h-full flex flex-col overflow-y-auto border-r bg-[#09090A] text-white
          ${isDark ? " border-r-[#1F1F22]" : "border-r-[#EFEFEF]"} 
          ${isHeader ? "translate-x-0" : "translate-x-[-100%]"}`}
      >
        <div className="w-full flex justify-end">
          <Button isIconOnly size="sm" onClick={() => setIsHeader(!isHeader)}>
            <FaAngleLeft />
          </Button>
        </div>
        <div>
          <div className="flex gap-x-3 items-center">
            <img
              src={Logo}
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover"
            />

            <div>
              <p
                className={classNames("font-bold text-[#EFEFEF]")}
              >
                Tech Store
              </p>
              <p
                className={classNames("text-sm text-[#EFEFEF]")}
              >
                techstore@gmail.com
              </p>
            </div>
          </div>

          <div
            className={classNames(
              "my-12 h-14 flex items-center gap-x-4 rounded-2xl px-4 text-[#EFEFEF]",
              {
                "bg-[#1F1F22] ": isDark,
                "bg-[#F5F5F5] ": !isDark,
              }
            )}
          >
            <div>
              <CiSearch className="text-xl" />
            </div>

            <input
              type="text"
              placeholder="Search..."
              className="flex-1 w-full bg-transparent outline-none"
            />
          </div>

          <div>
            {navResult && navResult.map((it) => {
              const NavIcon = it.icon;
              return (
                <NavLink
                  to={it.url}
                  key={`nav-item-${it.idNav}`}
                  className={classNames(
                    "flex items-center gap-x-4 p-4 rounded-2xl text-[#EFEFEF] hover:text-zinc-950 hover:bg-[#F5F5F5]",)}
                >
                  <div className="text-2xl">
                    <NavIcon />
                  </div>

                  <p>{it.content}</p>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="mt-auto">
          <div
            onClick={onOpen}
            className={classNames(
              "flex items-center gap-x-4 p-4 rounded-2xl cursor-pointer text-[#EFEFEF] hover:text-zinc-50 mb-3"
            )}
          >
            <div className="text-2xl">
              <ImProfile />
            </div>

            <p>Profile</p>
          </div>
          <div
            onClick={handleLogout}
            className={classNames(
              "flex items-center gap-x-4 p-4 rounded-2xl cursor-pointer text-[#EFEFEF] hover:text-zinc-50 mb-3"
            )}
          >
            <div className="text-2xl">
              <LuLogOut />
            </div>

            <p>Logout</p>
          </div>

          <div
            className={classNames("flex items-center gap-x-4 py-4 pl-4 text-[#EFEFEF]")}
          >
            <div className="text-2xl">
              <MdOutlineLightMode />
            </div>

            <p>{isDark ? "Dark mode" : "Light mode"}</p>

            <Switch
              isSelected={isDark}
              onChange={handleSetDarkMode}
              size="md"
              color="secondary"
              className="ml-auto"
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <FaMoon className={className} />
                ) : (
                  <FaSun className={className} />
                )
              }
            />
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className={`relative top-0 left-0 w-full h-[40px] flex content-start justify-start ${isDark ? "bg-[#1F1F1F]" : "bg-[#F5F5F5]"} p-1`}>
          <Button isIconOnly size="sm" onClick={() => setIsHeader(!isHeader)} className={`bg-blue-500 ${isHeader ? "opacity-0" : "opacity-100"} transition-all`}>
            <FaAngleRight className="text-white" />
          </Button>
        </div>
        {children}
      </main>
      <Modal isOpen={isOpen} onClose={onClose}>
        <CurrentUser />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;

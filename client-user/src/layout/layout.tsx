import { useContext } from "react"
import LoadingComponent from "../components/loading/loadingComponent"
import { useLocation } from "react-router-dom"
import { StateContext } from "../context/stateContext"
import Header from "./header"
import Auth from "../pages/auth/auth"
import ScrollToTop from "./scrollToTop"
import Footer from "./footer"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const location = useLocation()
  const { isLoading } = useContext(StateContext)
  return location.pathname !== "/auth" ?
    <section className="w-full h-auto min-h-screen flex flex-wrap content-start justify-center overflow-x-hidden">
      {isLoading && <LoadingComponent />}
      <ToastContainer />
      <Header />
      <main className="w-full h-auto min-h-[99vh] overflow-y-auto overflow-x-hidden">
        <div className="w-full h-auto">{children}</div>
      </main>
      <Footer />
      <ScrollToTop />
    </section>
    : <Auth />
}

export default Layout
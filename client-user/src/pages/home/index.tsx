import { lazy, Suspense, useEffect } from 'react'

const Laptop = lazy(() => import("./laptop"))
const Monitor = lazy(() => import("./monitor"))
const NewProduct = lazy(() => import("./newProduct"))
const Post = lazy(() => import("./post"))
const Slideshow = lazy(() => import("./slide"))
const SaleEvent = lazy(() => import("./sale"))

const Home = () => {
  useEffect(() => {
    document.title = "Tech Store"
  }, [])
  return <div className='w-full h-auto flex flex-col items-center pt-2 px-1'>
    <div className='w-full h-auto flex flex-wrap justify-center px-1'>
      <div className='w-full h-auto'>
        <Suspense fallback={<div data-testid="slideshow">LOADING...</div>}>
          <Slideshow />
        </Suspense>
      </div>
    </div>
    <Suspense fallback={<div data-testid="saleevent">LOADING...</div>}><SaleEvent /></Suspense>
    <Suspense fallback={<div data-testid="newproduct">LOADING...</div>}><NewProduct /></Suspense>
    <Suspense fallback={<div data-testid="laptop">LOADING...</div>}><Laptop /></Suspense>
    <Suspense fallback={<div data-testid="monitor">LOADING...</div>}><Monitor /></Suspense>
    <Suspense fallback={<div data-testid="post">LOADING...</div>}><Post /></Suspense>
  </div>

}

export default Home
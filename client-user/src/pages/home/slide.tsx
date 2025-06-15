import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../../context/stateContext";
import CategoryList from "./categoryList";
const Slideshow = () => {
  const { product } = useContext(StateContext);
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<any[] | null>(null);
  useEffect(() => {
    product && setData(product.filter((f: any) => f.type === "laptop")[0].data.filter((f: any) => f.view > 24).slice(0, 5))
  }, [product]);
  const timeoutRef = useRef<any | null>(null);
  const delay = 10000;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      // Thêm class 'inactive' vào phần tử hiện tại
      const currentElement = document.querySelector(".slide.active");
      if (currentElement) {
        currentElement.classList.add("inactive");
      }

      // Chờ 1 giây trước khi chuyển class 'active'
      setTimeout(() => {
        data !== null &&
          setIndex((prevIndex) =>
            prevIndex === data.length - 1 ? 0 : prevIndex + 1
          );

        // Xóa class 'inactive' sau khi đã chuyển 'active'
        if (currentElement) {
          currentElement.classList.remove("inactive");
        }
      }, 1000);
    }, delay);

    return () => {
      resetTimeout();
    };
  }, [index, data]);
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      // Thêm class 'inactive' vào phần tử hiện tại
      const currentElement = document.querySelector(".slide.active");
      if (currentElement) {
        currentElement.classList.remove("active");
        currentElement.classList.add("inactive");
      }

      // Chờ 1 giây trước khi chuyển class 'active'
      setTimeout(() => {
        data !== null &&
          setIndex((prevIndex) =>
            prevIndex === data.length - 1 ? 0 : prevIndex + 1
          );

        // Xóa class 'inactive' sau khi đã chuyển 'active'
        if (currentElement) {
          currentElement.classList.remove("inactive");
        }
      }, 1000);
    }, delay);

    return () => {
      resetTimeout();
    };
  }, [index, data]);

  return (
    <div className="slideshow relative min-h-[600px] flex flex-col justify-between">
      <div className="absolute w-full h-auto">
        <div className="w-full h-[50px] bg-gradient-to-b from-white to-zinc-100"></div>
        <div className="w-full h-[50px] bg-gradient-to-b from-zinc-100 to-zinc-200"></div>
        <div className="w-full h-[200px] bg-gradient-to-b from-zinc-200 to-zinc-200"></div>
        <div className="w-full h-[200px] bg-gradient-to-b from-zinc-200 to-zinc-200"></div>
        <div className="w-full h-[50px] bg-gradient-to-b from-zinc-200 to-zinc-100"></div>
        <div className="w-full h-[50px] bg-gradient-to-b from-zinc-100 to-white"></div>
      </div>
      <div className="item w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="slideshowSlider flex justify-center items-center" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
          {data !== null &&
            data.map((items, s) => (
              <div
                className={`slide${index === s ? " active inline-flex " : ""
                  } inline-flex  flex-col md:flex-row `}
                key={items.idProduct}
              >
                <div className="image w-full relative h-full">
                    <div className="images_detail w-full md:w-1/2 flex justify-center items-center">
                      <img
                        src={items.imgProduct}
                        alt=""
                        className="imgProduct w-1/2 md:w-[500px] h-full md:h-[500px] object-contain flex justify-center items-center"
                      />
                    </div>
                    <div className="w-full">
                      <span className="truncate flex items-center justify-center !text-zinc-900 !text-[30px] font-tech-shark font-semibold">
                        {items.nameProduct}
                      </span>
                    </div>
                  </div>
              </div>
            ))}
        </div>
        <CategoryList />
      </div>
    </div>
  );
}

export default Slideshow;

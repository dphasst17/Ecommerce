import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

//scroll-to-top classes: fixed, bottom:0, right:0
  return (

      <>
        {isVisible && (
          <div className="fixed bottom-[9rem] ssm:bottom-[9.5rem] sm:bottom-[10rem] md:bottom-[5rem] right-2 w-[40px] h-[40px] bg-zinc-900 rounded-md transition-all cursor-pointer z-50">
            <div className="w-full h-full flex items-center justify-center" onClick={scrollToTop}>
              <FaArrowUp/>
            </div>
          </div>
        )}

      </> 
  );
}
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Import Autoplay module
import "swiper/css";
import "swiper/css/navigation";

function Slider({
  items,
  loop = true,
  autoplay = false, // Correctly set the default value of autoplay
  className,
  slideClassName,
  sliderPerView = 3,
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <Swiper
        modules={[Navigation, Autoplay]} // Include Autoplay in modules
        spaceBetween={10}
        slidesPerView={sliderPerView}
        loop={loop}
        autoplay={
          autoplay
            ? {
                delay: 1000,
                disableOnInteraction: false,
              }
            : false
        }
        navigation
        className="h-full"
      >
        {items?.map((item, index) => (
          <SwiperSlide
            key={index}
            className={`flex items-center  ${slideClassName}`}
          >
            {typeof item === "function" ? item() : item}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slider;

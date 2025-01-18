import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Add Autoplay if needed

import "swiper/css";
import "swiper/css/navigation";

function Slider({
  items,
  min = 0,
  max = 100,
  loop = false,
  autoplay = false,
  className,
  slideClassName,
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        loop={loop}
        autoplay={
          autoplay
            ? {
                delay: 2000,
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

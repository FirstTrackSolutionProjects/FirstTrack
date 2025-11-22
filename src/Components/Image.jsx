import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  { image: "images/banner1.jpg", title: "YOUR TRUSTED LOGISTIC PARTNER IN WORLDWIDE SMART WAY" },
  { image: "images/banner2.jpg", title: "DELIVERING SPEED, RELIABILITY AND EXCELLENCE" },
  { image: "images/banner3.jpg", title: "FAST AND SECURE GLOBAL SHIPPING SOLUTIONS" },
  { image: "images/banner4.jpg", title: "OPTIMIZE YOUR BUSINESS WITH OUR LOGISTICS EXPERTISE" },
  { image: "images/banner5.jpg", title: "CONNECTING YOU TO THE WORLD, ONE SHIPMENT AT A TIME" },
];

const Image = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} style={{ width: "100%", marginRight: "0px" }}>
            <div className="relative w-full h-full">
              {/* Background image */}
              <img
                src={slide.image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              />

              {/* Overlay text */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-6">
                <h1
                  className="text-white text-2xl md:text-4xl font-bold leading-snug"
                  style={{
                    animation: "fadeInUp 1s ease-out",
                    maxWidth: "900px",
                  }}
                >
                  {slide.title}
                </h1>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Inline keyframes */}
      <style>{`
        .swiper {
          overflow: hidden !important;
        }
        .swiper-wrapper {
          transition-timing-function: ease-in-out !important;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Image;


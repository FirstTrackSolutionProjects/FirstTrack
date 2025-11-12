// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// const Image = () => {
//   const { isAuthenticated } = useAuth();
//   return (
//     <>
//       <div className="relative w-full h-[400px] md:h-[480px] p-2">
//         {/* Background Image */}
//         <img
//           src="images/banner.png" // Replace with your image URL
//           alt="Background"
//           className="w-full h-full object-cover" // Image with reduced opacity (dull)
//         />

//         {/* Text Overlay */}
//         <div className="absolute inset-0  flex items-center justify-center">
//           <h1 className="text-white text-3xl  bg-black bg-opacity-30 h-[400px] md:h-[480px] w-full px-4 py-2 rounded">
//             <div className="max-w-6xl my-20 md:my-32 mx-auto md:px-8">
//               <h1 className="w-1/2 items-center text-2xl md:text-4xl  font-bold mb-6">
//                 YOUR TRUSTED LOGISTIC <span className='text-gray-700'>PARTNER</span> IN WORLDWIDE SMART WAY
//               </h1>
//               {/* Buttons */}
//               <div className="space-x-4">
//                   <button className="bg-gray-700 text-sm md:text-base text-white py-3 px-6 rounded-lg transition duration-300">
//                     DISCOVER MORE
//                   </button>
//                 {
//                   isAuthenticated ? (
//                     <Link to="/dashboard"><button className="bg-white text-sm md:text-base text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
//                       DASHBOARD
//                     </button></Link>
//                   ) : <>
//                     <Link to="/login"><button className="bg-white text-sm md:text-base text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
//                       LOGIN
//                     </button></Link>
//                   </>
//                 }

//               </div>
//             </div>
//           </h1>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Image;

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


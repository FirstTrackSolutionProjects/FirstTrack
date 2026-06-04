import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom"; // Import Link for navigation

const slides = [
  { 
    image: "images/banner1.jpg", 
    subtitle: "Global Reach, Local Touch",
    title: "YOUR TRUSTED LOGISTIC PARTNER IN WORLDWIDE SMART WAY",
    ctaText: "GET A QUOTE",
    ctaLink: "/pricing"
  },
  { 
    image: "images/banner2.jpg", 
    subtitle: "Efficiency Redefined",
    title: "DELIVERING SPEED, RELIABILITY AND EXCELLENCE",
    ctaText: "LEARN MORE",
    ctaLink: "/about"
  },
  { 
    image: "images/banner3.jpg", 
    subtitle: "Security Guaranteed",
    title: "FAST AND SECURE GLOBAL SHIPPING SOLUTIONS",
    ctaText: "VIEW SERVICES",
    ctaLink: "#services"
  },
  { 
    image: "images/banner4.jpg", 
    subtitle: "Expertise Matters",
    title: "OPTIMIZE YOUR BUSINESS WITH OUR LOGISTICS EXPERTISE",
    ctaText: "CONTACT US",
    ctaLink: "/contact"
  },
  { 
    image: "images/banner5.jpg", 
    subtitle: "Connecting People",
    title: "CONNECTING YOU TO THE WORLD, ONE SHIPMENT AT A TIME",
    ctaText: "GET STARTED",
    ctaLink: "/login"
  },
];

const Image = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden group">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        speed={1200}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center">
              {/* Background image with zoom effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover transform scale-110 transition-transform duration-[10000ms] group-hover:scale-100"
                />
              </div>

              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center px-6 md:px-20 lg:px-32">
                <div className="max-w-4xl text-left">
                  <div className="overflow-hidden mb-4">
                    <span className="block text-green-400 font-bold uppercase tracking-widest text-xs md:text-sm animate-slide-up-fade">
                      {slide.subtitle}
                    </span>
                  </div>
                  <h1 className="text-white text-3xl md:text-6xl font-black leading-tight mb-8 animate-hero-text drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 animate-fade-in-up-delayed">
                    <div className="flex items-center gap-2 text-white/90 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Fast Tracking
                    </div>
                    <div className="flex items-center gap-2 text-white/90 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Global Support
                    </div>
                    {slide.ctaText && slide.ctaLink && (
                      slide.ctaLink.startsWith('#') ? (
                        <a href={slide.ctaLink} className="ml-4">
                          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2">
                            {slide.ctaText}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                          </button>
                        </a>
                      ) : (
                        <Link to={slide.ctaLink} className="ml-4">
                          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2">
                            {slide.ctaText}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                          </button>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hero Animation Styles */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes heroText {
          0% { opacity: 0; transform: translateY(40px) skewY(2deg); }
          100% { opacity: 1; transform: translateY(0) skewY(0deg); }
        }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(100%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-hero-text {
          animation: heroText 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.8s ease-out forwards;
        }
        .animate-fade-in-up-delayed {
          animation: slideUpFade 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default Image;


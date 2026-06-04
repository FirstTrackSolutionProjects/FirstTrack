import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import './TrustedPartner.css'; // For custom keyframes animation

const logos = [
  'images/partners/dhl.jpeg',
  'images/partners/bluedart.jpeg',
  'images/partners/razor.png',
  'images/partners/zoho.jpeg',
  'images/partners/delhivery.jpeg',
  'images/partners/gati.png',
  'images/partners/aws.jpg',
  'images/partners/xpress.jpeg',
  'images/partners/amazon.png',
  'images/partners/ekart.png',
  'images/partners/netlify.png',
  'images/partners/hostinger.png'
];

const TrustedPartnerSection = () => {
  
const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-gradient-to-t from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <div className="mb-16 md:mb-24">
          <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Industry Leaders</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">Our Trusted <span className="text-green-600">Partners</span></h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
        </div>
        <div className="flex justify-center items-center">
          <div className="slider">
            <div className="slider-track">
              {logos.map((logo, index) => (
                <div key={`first-${index}`} className="slider-item">
                  <img src={logo} alt={`Trusted partner ${index + 1}`} className=" w-36 h-24 md:w-48 md:h-32 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
                </div>
              ))}
              {/* Duplicate logos inside the same track for seamless looping */}
              {logos.map((logo, index) => (
                <div key={`second-${index}`} className="slider-item">
                  <img src={logo} alt={`Trusted partner ${index + 1}`} className=" w-36 h-24 md:w-48 md:h-32 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TrustedPartnerSection;

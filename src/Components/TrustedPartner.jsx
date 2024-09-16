import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import './TrustedPartner.css'; // For custom keyframes animation

const logos = [
  '/path-to-logo1.png',
  '/path-to-logo2.png',
  '/path-to-logo3.png',
  '/path-to-logo4.png',
  '/path-to-logo5.png',
  '/path-to-logo6.png',
  // Add more logos as needed
];

const TrustedPartnerSection = () => {
  
const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">Our Trusted Partners</h2>
        <div className="flex justify-center items-center">
          <div className="slider">
            <div className="slider-track">
              {logos.map((logo, index) => (
                <div key={index} className="slider-item">
                  <img src={logo} alt={`Trusted partner ${index + 1}`} className="h-16 md:h-24 object-contain" />
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

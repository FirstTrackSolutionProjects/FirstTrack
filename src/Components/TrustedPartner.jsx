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
  'images/partners/xpress.jpeg',
  // Add more logos as needed
];

const TrustedPartnerSection = () => {
  
const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });

  return (
    <section ref={ref} className="my-3 py-16 bg-neutral-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-10">Our Trusted Partners</h2>
        <div className="flex justify-center items-center ">
          <div className="slider">
            <div className="slider-track">
              {logos.map((logo, index) => (
                <div key={index} className="slider-item">
                  <img src={logo} alt={`Trusted partner ${index + 1}`} className=" w-32 h-20 md:w-44 md:h-28 object-fill rounded-xl" />
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

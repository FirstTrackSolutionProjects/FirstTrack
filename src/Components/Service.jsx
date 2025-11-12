import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { services } from '../Constants';


const Service = () => {
  // Using Intersection Observer to detect if the section is in view
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });

 return (
    <section ref={ref} className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-gray-800">
          Our Capabilities
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`p-5 md:p-6 bg-white shadow-md rounded-xl transform transition-all duration-700 ${
                inView
                  ? `opacity-100 translate-y-0 delay-[${index * 200}ms]`
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-4xl md:text-5xl mb-4">{service.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
                {service.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Grid Section
const Grid = () => {
  return (
    <div className="bg-green-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 px-5 md:px-10">
        {/* Text Section */}
        <div className="grid grid-rows-3 gap-6">
          <div>
            <div className="font-semibold text-green-600 text-lg mb-2">
              Our Mission
            </div>
            <div className="text-gray-800 text-justify">
              To redefine logistics through innovation, speed, and service excellence —
              empowering businesses and individuals to move goods across the globe with
              confidence and reliability.
            </div>
          </div>
          <div>
            <div className="font-semibold text-green-600 text-lg mb-2">
              Our Vision
            </div>
            <div className="text-gray-800 text-justify">
              To become the most trusted global logistics partner by integrating
              technology, sustainability, and customer-centric practices in every step of
              our operations.
            </div>
          </div>
          <div>
            <div className="font-semibold text-green-600 text-lg mb-2">
              Our Values
            </div>
            <div className="text-gray-800 text-justify">
              We believe in integrity, transparency, and continuous improvement. Every
              shipment is handled with accountability and care, ensuring lasting trust with
              every client we serve.
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="grid grid-rows-2 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <img
              src="images/blog1.jpeg"
              className="object-cover w-full h-44 rounded-lg shadow-md"
              alt="Warehouse"
            />
            <img
              src="images/blog2.jpeg"
              className="object-cover w-full h-44 rounded-lg shadow-md"
              alt="Cargo"
            />
          </div>
          <div>
            <img
              src="images/blog3.jpg"
              className="object-cover w-full h-52 rounded-lg shadow-md"
              alt="Shipping"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Landing Page (Combining Both Sections)
const Landing = () => {
  return (
    <div>
      <Service />
      <Grid />
    </div>
  );
};

export default Landing;
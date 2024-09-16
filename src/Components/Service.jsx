import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    id: 1,
    title: "Global Shipping",
    description: "We ensure timely and secure delivery across the world.",
    icon: "🚚",
  },
  {
    id: 2,
    title: "Warehousing",
    description: "Safe and affordable warehousing solutions for your business.",
    icon: "🏬",
  },
  {
    id: 3,
    title: "Cargo Services",
    description: "Fast and reliable cargo transportation services.",
    icon: "✈️",
  },
  {
    id: 4,
    title: "Freight Management",
    description: "Optimize your logistics with our expert freight management services.",
    icon: "⚓",
  },
];

const Service = () => {
  // Using Intersection Observer to detect if the section is in view
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`p-6 bg-white shadow-md rounded-lg transform transition-all duration-700 ${
                inView
                  ? `opacity-100 translate-y-0 delay-[${index * 200}ms]`
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

{/*About Section */}
const Grid=()=>{
    return(
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div className='grid grid-rows-3 gap-4 p-5'>
                    <div>
                        <div className='font-semibold text-green-600'>Our Mission</div>
                        <div className='text-justify text-gray-800'>To provide fast, reliable, and cost-effective logistics and shipping solutions, ensuring that our customers’ goods are delivered safely and on time, every time.</div>
                    </div>
                    <div>
                        <div className='font-semibold text-green-600'>Our Vision</div>
                        <div className='text-justify text-gray-800'>To provide fast, reliable, and cost-effective logistics and shipping solutions, ensuring that our customers’ goods are delivered safely and on time, every time.</div>
                    </div>
                    <div>
                        <div className='font-semibold text-green-600'>Our Values</div>
                        <div className='text-justify text-gray-800'>We prioritize the needs of our customers and strive to exceed their expectations with every shipment.We operate with honesty and transparency, building trust with our clients and partners.</div>
                        </div>
                </div>
                <div className='grid grid-rows-2 gap-2'>
                    <div className='flex gap-2'>

                    </div>
                    <div>

                    </div>
                    
                </div>
            </div>
        </div>
    )
}


const Landing =() =>{
    return(
        <div>
            <Service/>
            <Grid/>
        </div>
    )
}

export default Landing;

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { services } from '../Constants/index.jsx';


const Service = () => {
  // Using Intersection Observer to detect if the section is in view
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });

  return (
    <section ref={ref} className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-5 md:mb-12 text-gray-800">
          Our Services
        </h2>

        <div className="grid grid-cols-2  md:grid-cols-4 gap-2 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`p-3 md:p-6 bg-white shadow-md rounded-lg transform transition-all duration-700 ${
                inView
                  ? `opacity-100 translate-y-0 delay-[${index * 200}ms]`
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-3xl md:text-5xl mb-4">{service.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{service.description}</p>
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 bg-green-50'>
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
                <div className='grid grid-rows-2 h-fit p-5'>
                    <div className='grid grid-cols-2 gap-2'>
                      <img src="images/blog1.jpeg" className='object-cover w-full h-40'></img>
                      <img src="images/blog2.jpeg" className='object-cover w-full h-40'></img>
                    </div>
                    <div className="">
                    <img src="images/blog3.jpg" className='object-contain w-full h-44'></img>
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

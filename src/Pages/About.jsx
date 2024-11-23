import React from 'react';
import { FaGlobe, FaHandshake, FaPlane, FaShippingFast } from 'react-icons/fa';

import { useInView } from 'react-intersection-observer';
import { whyChooseUs , services} from '../Constants/index.jsx';


const AboutUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });
  return (
    <div className="font-inter text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] p-2">
      {/* Background Image */}
      <img
        src="images/about2.jpg" // Replace with your image URL
        alt="About Us Background"
        className="w-full h-full object-cover"
      />

      {/* Full-width background with centered text */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-white text-6xl font-bold">
          About Us
        </h1>
      </div>
    </div>

  

      {/* Mission & Values */}
      <section className="py-5 md:py-12 bg-gray-100">
        <div className="max-w-6xl p-2 mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          <div className="p-6 bg-blue-50 rounded-lg shadow-md text-center">
            <div className="text-blue-800 mb-4">
              <FaShippingFast className='text-4xl mx-auto'/>
            </div>
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="mt-4 text-gray-600">To deliver the best logistics solutions with unparalleled customer service.</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg shadow-md text-center">
            <div className="text-green-500 mb-4">
              <FaGlobe className='text-4xl mx-auto'/>
            </div>
            <h3 className="text-xl font-semibold">Our Vision</h3>
            <p className="mt-4 text-gray-600">Connecting the world through fast, reliable, and efficient shipping services.</p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg shadow-md text-center">
            <div className="text-yellow-500 mb-4">
              <FaHandshake className='text-4xl mx-auto'/>
            </div>
            <h3 className="text-xl font-semibold">Our Values</h3>
            <p className="mt-4 text-gray-600">Integrity, innovation, and customer-first solutions in every delivery.</p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section ref={ref} className="py-12">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold">Our Services</h2>
          <p className="text-gray-600 mt-4">Offering a wide range of logistics solutions tailored to your needs.</p>
        </div>
        <div className="grid grid-cols-2  md:grid-cols-4 gap-2 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`p-3 mx-auto px-4 text-center md:p-6 bg-white shadow-md rounded-lg transform transition-all duration-700 ${
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
      </section>

      {/* Team Section */}
      <section className="py-5 md:py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 p-2 gap-3 md:gap-8 max-w-6xl mx-auto">
          {/* Example Team Member */}
          <div className="md:p-3 p-6 bg-white rounded-lg shadow-md text-center">
            <img
              src="images/male.png"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-xl font-semibold">ABC</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </div>
          {/* Add other team members similarly */}
        </div>
      </section>

      {/* Why Choose Us */}
    
      <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>

        <div className="grid grid-cols-1  md:grid-cols-4 gap-4 md:gap-8">
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className="p-3 md:p-6 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition duration-300 text-center"
            >
              <img src={item.image} className='mx-auto h-12 w-12 md:w-20 md:h-20 object-contain my-2'></img>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

     
    </div>
  );
};

export default AboutUs;

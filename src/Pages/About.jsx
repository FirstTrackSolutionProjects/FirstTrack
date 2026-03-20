import React from 'react';
import { FaGlobe, FaHandshake, FaPlane, FaShippingFast } from 'react-icons/fa';

import { useInView } from 'react-intersection-observer';
import { whyChooseUs , services} from '../Constants';


const AboutUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation only once (set to false for repeat on scroll out/in)
    threshold: 0.1, // Trigger when 10% of the section is visible
  });
  return (
    <div className="font-inter text-gray-800 antialiased"> {/* Added antialiased for smoother fonts */}
      {/* Hero Section */}
      <div className="relative w-full h-[400px] p-2">
      {/* Background Image */}
      <img
        src="/images/about2.jpg" 
        alt="About Us Background"
        className="w-full h-full object-cover"
      />

      {/* Full-width background with centered text and gradient overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black via-black/40 to-transparent">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg text-center px-4"> {/* Responsive text, bolder font, shadow */}
          About Us
        </h1>
      </div>
    </div>

     {/* Company Intro Section */}
      <section className="py-12 bg-white max-w-6xl mx-auto px-4 shadow-inner rounded-lg my-8"> {/* Added background, more padding, shadow, rounded corners, margin */}
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center md:text-left"> {/* Increased text size, left align on md */}
        <strong className="text-blue-600">First Track</strong>, a proud venture of <strong className="text-blue-600">First Track Solutions Technologies Pvt Ltd</strong>, is a dedicated logistics platform committed to delivering speed, safety, and operational excellence across the supply chain. Officially registered in Bhubaneswar, Odisha in <strong className="text-blue-600">October 2022</strong>, the platform was created with a clear vision: to introduce next-generation tracking and highly reliable transport solutions to businesses nationwide.
        <br/><br/> {/* Added line breaks for separation */}
        At <strong className="text-blue-600">First Track</strong>, we recognize that effective logistics is the backbone of commerce. We believe every shipment represents critical time and capital, and our dedicated technology and vast carrier network ensure that every movement—from warehousing to last-mile delivery—is executed with precision and transparency.
        </p>
      </section>

      {/* Mission & Values */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100"> {/* Updated background for a modern feel */}
        <div className="max-w-6xl p-2 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"> {/* Adjusted gaps */}
          <div className="p-6 bg-blue-50 rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-blue-700 mb-4"> {/* Slightly darker blue */}
              <FaShippingFast className='text-4xl mx-auto'/>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
            <p className="mt-4 text-gray-700">To deliver the best logistics solutions with unparalleled customer service.</p>
          </div>
          <div className="p-6 bg-green-50 rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-green-600 mb-4"> {/* Slightly darker green */}
              <FaGlobe className='text-4xl mx-auto'/>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
            <p className="mt-4 text-gray-700">Connecting the world through fast, reliable, and efficient shipping services.</p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-yellow-600 mb-4"> {/* Slightly darker yellow */}
              <FaHandshake className='text-4xl mx-auto'/>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Our Values</h3>
            <p className="mt-4 text-gray-700">Integrity, innovation, and customer-first solutions in every delivery.</p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section ref={ref} className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">Our Services</h2>
          <p className="text-gray-600 mt-4 text-lg">Offering a wide range of logistics solutions tailored to your needs.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto px-4"> {/* Adjusted gaps and max-width */}
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`p-3 mx-auto px-4 text-center md:p-6 bg-white shadow-lg rounded-xl transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                inView
                  ? `opacity-100 translate-y-0`
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }} 
            >
              <div className="text-3xl md:text-5xl mb-4 text-blue-500">{service.icon}</div> {/* Added blue accent to icons */}
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 md:py-16 bg-gray-50"> {/* Adjusted padding and background */}
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-2 gap-6 md:gap-8 max-w-6xl mx-auto"> {/* Added sm breakpoint */}
          {/* Example Team Member */}
          <div className="md:p-3 p-6 bg-white rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <img
              src="images/male.png"
              alt="Tejash Parekh"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-200 p-1 mb-4" 
            />
            <h3 className="text-xl font-semibold text-gray-800">Tejash Parekh</h3>
            <p className="text-blue-600 font-medium text-base mt-1">CEO & Founder</p> {/* Changed color and font weight */}
          </div>
          {/* Add other team members similarly */}
          {/* Duplicate for visual effect if only one is present for now */}
          <div className="md:p-3 p-6 bg-white rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <img
              src="images/male.png" // Placeholder
              alt="Team Member 2"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-200 p-1 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Rahul Sharma</h3>
            <p className="text-blue-600 font-medium text-base mt-1">Chief Operating Officer</p>
          </div>
          <div className="md:p-3 p-6 bg-white rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <img
              src="images/female.webp" // Placeholder
              alt="Team Member 3"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-200 p-1 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Priya Singh</h3>
            <p className="text-blue-600 font-medium text-base mt-1">Head of Technology</p>
          </div>
          <div className="md:p-3 p-6 bg-white rounded-xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <img
              src="images/male.png" // Placeholder
              alt="Team Member 4"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-200 p-1 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Amit Kumar</h3>
            <p className="text-blue-600 font-medium text-base mt-1">Logistics Manager</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
    
      <section className="py-10 md:py-16 bg-white"> {/* Adjusted padding */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-12">Why Choose Us</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"> {/* Added sm breakpoint, adjusted gaps */}
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className="p-3 md:p-6 bg-gray-50 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 text-center transform hover:scale-105"
            >
              <img src={item.image} alt={item.title} className='mx-auto h-16 w-16 md:w-24 md:h-24 object-contain my-2 transform hover:rotate-3 scale-110 transition duration-300'></img> {/* Increased icon size and added hover effect */}
              <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-700">{item.title}</h3> {/* Made title bold and blue */}
              <p className="text-sm md:text-base text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

     
    </div>
  );
};

export default AboutUs;

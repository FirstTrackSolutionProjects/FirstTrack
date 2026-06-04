import React from 'react';
import { useInView } from 'react-intersection-observer';
import { whyChooseUs, services } from '../Constants';
import { Globe, Handshake, Truck } from 'lucide-react'; // Using Lucide-React for modern icons


const AboutUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.1, // Trigger when 10% of the section is visible
  });

  return (
    <div className="font-inter text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        {/* Background Image with subtle zoom effect */}
        <img
          src="/images/about2.jpg"
          alt="About Us Background"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center justify-center px-4 md:px-20">
          <div className="max-w-4xl text-center">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg animate-hero-text">
              About <span className="text-green-400">First Track</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mt-4 max-w-2xl mx-auto animate-fade-in-up-delayed" style={{animationDelay: '0.4s'}}>
              Your trusted partner in global logistics, delivering excellence with every shipment.
            </p>
          </div>
        </div>
      </div>

      {/* Company Intro Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="mb-16 md:mb-24">
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Our Journey</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Delivering Excellence <span className="text-green-600">Since 2022</span></h2>
            <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
          </div>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            <span className="text-black font-bold">First</span> <span className="text-[#22c55e] font-bold">Track</span>, a proud venture of <span className="text-black font-bold">First Track Solutions Technologies Pvt Ltd</span>, is a dedicated logistics platform committed to delivering speed, safety, and operational excellence across the supply chain. Officially registered in Bhubaneswar, Odisha in <strong>October 2022</strong>, the platform was created with a clear vision: to introduce next-generation tracking and highly reliable transport solutions to businesses nationwide.
            <br/><br/>
            At <span className="text-black font-bold">First</span> <span className="text-[#22c55e] font-bold">Track</span>, we recognize that effective logistics is the backbone of commerce. We believe every shipment represents critical time and capital, and our dedicated technology and vast carrier network ensure that every movement—from warehousing to last-mile delivery—is executed with precision and transparency.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section ref={ref} className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16 md:mb-24">
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Our Core</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Mission, Vision & <span className="text-green-600">Values</span></h2>
            <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div
              style={{ transitionDelay: `0ms` }}
              className={`p-8 md:p-12 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-700 hover:shadow-2xl hover:shadow-green-300/40 hover:-translate-y-1 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-green-50 flex items-center justify-center rounded-3xl mb-6 shadow-inner text-green-600">
                <Truck className='text-4xl md:text-5xl'/>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tight mb-3">Our Mission</h3>
              <p className="text-gray-600 text-base leading-relaxed">To deliver the best logistics solutions with unparalleled customer service and operational excellence.</p>
            </div>
            <div
              style={{ transitionDelay: `150ms` }}
              className={`p-8 md:p-12 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-700 hover:shadow-2xl hover:shadow-green-300/40 hover:-translate-y-1 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-green-50 flex items-center justify-center rounded-3xl mb-6 shadow-inner text-green-600">
                <Globe className='text-4xl md:text-5xl'/>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tight mb-3">Our Vision</h3>
              <p className="text-gray-600 text-base leading-relaxed">Connecting the world through fast, reliable, and efficient shipping services for a seamless global trade.</p>
            </div>
            <div
              style={{ transitionDelay: `300ms` }}
              className={`p-8 md:p-12 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-700 hover:shadow-2xl hover:shadow-green-300/40 hover:-translate-y-1 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-green-50 flex items-center justify-center rounded-3xl mb-6 shadow-inner text-green-600">
                <Handshake className='text-4xl md:text-5xl'/>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tight mb-3">Our Values</h3>
              <p className="text-gray-600 text-base leading-relaxed">Integrity, innovation, and customer-first solutions are at the heart of every delivery we make.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section ref={ref} className="py-16 md:py-24 bg-gradient-to-t from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16 md:mb-24">
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Our Comprehensive <span className="text-green-600">Services</span></h2>
            <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {services.map((service, index) => (
              <div
                key={service.id}
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`group p-8 md:p-10 bg-white shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-green-300/40 rounded-[2.5rem] transform transition-all duration-700 border border-gray-100 hover:border-green-200 flex flex-col items-center ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                }`}
              >
                <div className="text-5xl md:text-6xl mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 bg-green-50 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-3xl shadow-inner text-green-600">
                  {service.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base font-medium">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16 md:mb-24">
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Our Innovators</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Meet Our <span className="text-green-600">Leadership</span> Team</h2>
            <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {/* Example Team Member */}
            <div
              style={{ transitionDelay: `0ms` }}
              className={`p-8 md:p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-700 hover:shadow-2xl hover:shadow-green-300/40 hover:-translate-y-1 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <img
                src="images/male.png"
                alt="Tejash Parekh"
                className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-green-100 shadow-md mb-6"
                loading="lazy"
              />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Tejash Parekh</h3>
              <p className="text-green-600 font-semibold text-lg">CEO & Founder</p>
              <p className="text-gray-600 text-sm mt-3">Visionary leader driving innovation and strategic growth.</p>
            </div>
            {/* Add other team members similarly */}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16 md:mb-24">
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Our Advantage</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Why Partner With <span className="text-green-600">First Track</span></h2>
            <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          >
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-green-300/40 hover:border-green-200 rounded-[2.5rem] p-8 flex flex-col items-center text-center transform transition-all duration-700 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 flex items-center justify-center rounded-3xl mb-6 shadow-inner transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

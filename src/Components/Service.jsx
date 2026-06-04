import React from 'react';
import { useInView } from 'react-intersection-observer';
import { services } from '../Constants';


const Service = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

 return (
    <section id="services" ref={ref} className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-16 md:mb-24">
          <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Our Core Offerings</span>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
            Powerful <span className="text-green-600">Logistics</span> Solutions
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to ship, manage, and scale your business globally.
          </p>
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
              className="object-cover w-full aspect-[4/3] rounded-lg shadow-md"
              alt="Warehouse"
            />
            <img
              src="images/blog2.jpeg"
              className="object-cover w-full aspect-[4/3] rounded-lg shadow-md"
              alt="Cargo"
            />
          </div>
          <div>
            <img
              src="images/blog3.jpg"
              className="object-cover w-full aspect-[16/9] rounded-lg shadow-md"
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
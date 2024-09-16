import React from 'react'
import Image from '../Components/Image'
import Service from '../Components/Service'
import PriceCalc from '../Components/PriceCalc';
import TrustedPartnerSection from '../Components/TrustedPartner';

const testimonials = [
  {
    name: "John Doe",
    feedback: "First Track Express has been an absolute pleasure to work with. Professional, reliable, and timely!",
    avatar: "/path-to-avatar1.jpg",
  },
  {
    name: "Jane Smith",
    feedback: "Their global shipping services have helped expand my business. Truly world-class.",
    avatar: "/path-to-avatar2.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 italic mb-4">"{testimonial.feedback}"</p>
              <h4 className="text-xl font-semibold">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const whyChooseUs = [
  { title: "Reliable Service", description: "Our reputation speaks for itself." },
  { title: "Secure Transportation", description: "Ensuring safety of all deliveries." },
  { title: "Timely Delivery", description: "We pride ourselves on promptness." },
  { title: "24/7 Support", description: "Customer support around the clock." },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition duration-300 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const NewsletterSection = () => {
  return (
    <section className="relative w-full py-16 bg-cover bg-center bg-[url('/path-to-your-background-image.jpg')]">
      <div className="absolute inset-0 bg-blue-800 bg-opacity-75"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with First Track Express
          </h2>
          <p className="text-lg mb-6">
            Subscribe to our newsletter and get the latest updates on logistics and shipping.
          </p>

          <form className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full md:w-auto px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="w-full md:w-auto bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};



const Home = () => {
  return (
    <div className='font-poppins z-10'>
      <Image/>
      <Service/>
      <WhyChooseUs/>
      <PriceCalc/>
      <Testimonials/>
      <NewsletterSection/>
      <TrustedPartnerSection/>
    </div>
  )
}

export default Home

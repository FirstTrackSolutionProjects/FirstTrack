import React from 'react'
import Image from '../Components/Image'
import Service from '../Components/Service'
import PriceCalc from '../Components/PriceCalc';
import TrustedPartnerSection from '../Components/TrustedPartner';
import HomeCalculator from '../Components/HomeCalculator';
import {testimonials,whyChooseUs} from '../Constants/index'

const Testimonials = () => {
  return (
    <section className="py-5 md:py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-3 md:p-6 rounded-lg shadow-md">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4"
              />
              <p className="text-sm md:text-base text-gray-600 italic mb-4">"{testimonial.feedback}"</p>
              <h4 className="text-sm md:text-base font-semibold">- {testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const WhyChooseUs = () => {
  return (
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
  );
};

const Calc =()=>{
  return(
    <div className='h-fit bg-gray-100 my-5'>
    <div className="justify-center items-center gap-2 text-center text-lg md:text-3xl font-medium py-5 flex">
          <div className="border-b-2 border-green-500 w-8 md:w-14"></div>
          <div>Calculate Your Shipping Price</div>
        </div>
    <div className='grid grid-cols-1 md:grid-cols-2 md:px-10'>
      <div className=''><HomeCalculator/></div>
      <div><img src="images/delivery.png" className='p-3 md:p-0 items-center mx-auto flex object-cover'></img></div>
    </div>
    </div>
  )
}


const NewsletterSection = () => {
  return (
    <section className="relative w-full py-5 md:py-16 bg-cover bg-center bg-[url('/path-to-your-background-image.jpg')]">
      <div className="absolute inset-0 bg-blue-800 bg-opacity-70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Stay Updated with First Track Express
          </h2>
          <p className="text-base md:text-lg mb-6">
            Subscribe to our newsletter and get the latest updates on logistics and shipping.
          </p>

          <form className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full text-sm md:text-base md:w-auto px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="w-full text-sm md:text-base md:w-auto bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
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
      <Calc/>
      <NewsletterSection/>
      <Testimonials/>
      <TrustedPartnerSection/>
    </div>
  )
}

export default Home

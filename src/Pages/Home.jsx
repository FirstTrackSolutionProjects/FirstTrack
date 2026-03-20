import React from 'react'
import Image from '../Components/Image'
import HeroAction from '../Components/HeroAction'
import Service from '../Components/Service'
import PriceCalc from '../Components/PriceCalc'; // Note: PriceCalc is imported but not used.
import TrustedPartnerSection from '../Components/TrustedPartner';
import HomeCalculator from '../Components/HomeCalculator';
import {testimonials,whyChooseUs,counts} from '../Constants'
import { useInView } from 'react-intersection-observer';
import CounterCard from '../Components/CounterCard';

const Testimonials = () => {
  return (
    <section className="py-10 md:py-20 bg-white"> {/* Changed background to white for cleaner look */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center"> {/* Adjusted padding */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-12"> {/* Larger, bolder heading */}
          What Our <span className="text-green-600">Clients Say</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"> {/* Added lg breakpoint, increased gap */}
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" // Modernized card styling, added hover effect
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full mx-auto mb-5 border-4 border-green-200 object-cover" // Slightly larger avatar, added subtle border
              />
              <p className="text-base md:text-lg text-gray-700 italic mb-5 leading-relaxed">"{testimonial.feedback}"</p> {/* Refined text styling */}
              <h4 className="text-md md:text-lg font-semibold text-gray-800">- {testimonial.name}</h4> {/* Refined name styling */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const WhyChooseUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white"> {/* Adjusted padding and gradient */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8"> {/* Adjusted padding */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-14"> {/* Larger, bolder heading */}
          Why Choose <span className="text-green-600">Us</span>
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12" // Increased gap
        >
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-100 shadow-lg hover:shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center transform transition-all duration-700 ease-out hover:scale-105 group ${ // Modernized card styling, added scale on hover, group for complex hover
                inView
                  ? `opacity-100 translate-y-0 delay-[${index * 150}ms]`
                  : "opacity-0 translate-y-12" // Increased initial translation for more dramatic entrance
              }`}
            >
              <div className="w-24 h-24 bg-green-100 flex items-center justify-center rounded-full mb-6 shadow-md group-hover:bg-green-200 transition-colors duration-300"> {/* Larger icon circle, added hover effect */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain transition-transform duration-300 group-hover:scale-110" // Larger icon, added scale on hover
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300"> {/* Larger, bolder title, added hover effect */}
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};




const Calc =()=>{
  return(
    <div className='h-fit bg-gray-50 py-12 md:py-20'> {/* Adjusted padding and background */}
      <div className="flex flex-col items-center text-center px-6 mb-12"> {/* Centered content, added bottom margin */}
        <div className="relative mb-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Calculate Your <span className="text-green-600">Shipping Price</span>
          </h2>
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-24 h-1 bg-green-500 rounded-full"></div> {/* Modern divider */}
        </div>
        <p className="text-gray-600 text-lg max-w-2xl">
          Get an instant quote for your logistics needs. Enter your details and let us handle the rest.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto px-6 lg:px-8 items-center gap-10 md:gap-16'> {/* Aligned items, increased gap */}
        <div className=''><HomeCalculator/></div>
        <div className="flex justify-center"> {/* Centered image */}
          <img 
            src="images/delivery.png" 
            alt="Delivery service illustration" // Added alt text
            className='p-3 md:p-0 items-center mx-auto flex object-contain max-h-96 w-full max-w-lg shadow-xl rounded-xl' // Improved image styling
          />
        </div>
      </div>
    </div>
  )
}


const NewsletterSection = () => {
  return (
    <section className="relative w-full py-16 md:py-24 bg-cover bg-center bg-gray-900" 
             style={{ backgroundImage: "url('/images/newsletter-bg.jpg')" }}> {/* Added a default background image path, recommend user replace */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div> {/* Darker, slightly desaturated blue overlay */}
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight"> {/* Larger, bolder heading */}
            Stay Updated with <span className="text-green-400">First Track</span>
          </h2>
          <p className="text-base md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"> {/* Larger text, increased margin, max-width */}
            Subscribe to our newsletter and get the latest updates, exclusive offers, and insights on logistics and shipping directly to your inbox.
          </p>

          <form className="flex flex-col md:flex-row justify-center items-center space-y-5 md:space-y-0 md:space-x-4 max-w-2xl mx-auto"> {/* Increased spacing */}
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address for newsletter" // Added ARIA label
              className="w-full text-base md:text-lg px-6 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-green-400 focus:outline-none text-gray-900 placeholder-gray-500 shadow-md" // Modernized input style
            />
            <button 
              type="submit" 
              className="w-full text-base md:text-lg md:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg" // Modernized button style
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};



const Counter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Changed to true for a single animation on load
    threshold: 0.1, // Trigger when 10% of the section is visible
  });
  return(
    <section ref={ref} className="py-12 md:py-20 bg-gradient-to-t from-gray-100 to-white"> {/* Adjusted padding and background gradient */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-14 text-gray-900"> {/* Larger, bolder heading */}
          First Track <span className="text-green-600">Superiority</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 px-4 md:px-0"> {/* Adjusted grid and gap, removed excessive px on grid */}
          {counts.map((count, index) => (
            <div
              key={count.id}
              className={`p-6 md:p-8 bg-white shadow-xl rounded-3xl transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl ${ // Modernized card styling, added hover effect
                inView
                  ? `opacity-100 translate-y-0 delay-[${index * 200}ms]`
                  : "opacity-0 translate-y-16" // Increased initial translation
              }`}
            >
              <CounterCard className="text-gray-900 text-5xl md:text-6xl font-extrabold mb-3 block" count={count.num} symbol={count.sym} speed={10} /> {/* Larger, bolder count */}
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-700">{count.title}</h3> {/* Larger, clearer title */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



const Home = () => {
 
  return (
    <div className='font-poppins relative z-10 overflow-hidden'> {/* Added overflow-hidden to prevent layout shifts from animations */}
      <Image/>
      <HeroAction/>
      <Service/>
      <WhyChooseUs/>
      <Counter/>
      <Calc/>
      <NewsletterSection/>
      <Testimonials/>
      <TrustedPartnerSection/>
    </div>
  )
}

export default Home

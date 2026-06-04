import React from 'react'
import Image from '../Components/Image'
import HeroAction from '../Components/HeroAction'
import Service from '../Components/Service'
import PriceCalc from '../Components/PriceCalc';
import TrustedPartnerSection from '../Components/TrustedPartner';
import HomeCalculator from '../Components/HomeCalculator';
import {testimonials,whyChooseUs,counts} from '../Constants'
import { useInView } from 'react-intersection-observer';
import CounterCard from '../Components/CounterCard';

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-16 md:mb-24">
          <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Customer Stories</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">What Our Clients <span className="text-green-600">Say</span></h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-500 hover:shadow-2xl hover:shadow-green-300/40 hover:-translate-y-1">
              <div className="absolute top-0 left-12 transform -translate-y-1/2">
                <div className="bg-green-500 p-3 rounded-2xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.34315 15.3602 2 17.017 2H19.017C20.6739 2 22.017 3.34315 22.017 5V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91243 8 3.017 7.10457 3.017 6V5C3.017 3.34315 4.36015 2 6.017 2H8.017C9.67386 2 11.017 3.34315 11.017 5V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" /></svg>
                </div>
              </div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 mt-4 font-medium italic">
                "{testimonial.feedback}"
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
                  loading="lazy"
                />
                <div className="text-left">
                  <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                  </div>
                </div>
              </div>
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
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Our Advantage</span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Why Partner With <span className="text-green-600">First Track</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl">
            We combine cutting-edge technology with industry expertise to deliver unmatched logistics excellence.
          </p>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div
          ref={ref}
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
  );
};




const Calc =()=>{
  return(
    <section className='bg-white py-16 md:py-24'>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Transparent Pricing</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Calculate Your Shipping <span className="text-green-600">Price</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl">
            Get instant quotes for your domestic and international shipments.
          </p>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center'>
          <div className='bg-gray-50 p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100'><HomeCalculator/></div>
          <div><img src="images/delivery.png" className='p-4 lg:p-0 items-center mx-auto flex object-contain max-w-sm lg:max-w-full' alt="Delivery illustration" loading="lazy"></img></div>
        </div>
      </div>
    </section>
  )
}


const NewsletterSection = () => {
  return (
    <section className="relative w-full py-16 md:py-28 bg-blue-900 overflow-hidden isolate">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-15">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[80%] bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[80%] bg-green-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-blue-100 uppercase bg-blue-800 bg-opacity-50 rounded-full border border-blue-700">
          Stay Informed
        </div>
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Stay Updated with <span className="text-green-400">First Track</span>
        </h2>
        
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
          Get the latest logistics insights, shipping tips, and exclusive updates delivered directly to your inbox.
        </p>

        <form 
          onSubmit={(e) => e.preventDefault()} 
          className="relative max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            className="flex-grow px-6 py-4 rounded-xl text-gray-900 bg-white border-2 border-transparent focus:border-green-400 focus:outline-none shadow-lg transition-all duration-300 placeholder-gray-500"
          />
          <button 
            type="submit"
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 transform transition hover:-translate-y-0.5 active:translate-y-0 duration-300 flex items-center justify-center gap-2"
          >
            Subscribe
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
        
        <p className="mt-6 text-sm text-blue-200 opacity-60">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};



const Counter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.2, // Trigger when 20% of the section is visible
  });
  return(
    <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Our Achievements</span>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-10 md:mb-16 text-gray-900 leading-tight">
          First Track <span className="text-green-600">Superiority</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-4 md:px-0">
          {counts.map((count, index) => (
            <div
              key={count.id}
              style={{ transitionDelay: `${index * 200}ms` }}
              className={`p-6 md:p-8 bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 transform transition-all duration-700 ${
                inView
                  ? `opacity-100 translate-y-0`
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="mb-4">
                <CounterCard count={count.num} symbol={count.sym} speed={count.speed || 5} className="text-gray-900"/>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-700">{count.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



const Home = () => {
 
  return (
    <div className='font-poppins z-10'>
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

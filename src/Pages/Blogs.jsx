import React from 'react';
import Image from '../Components/Image';
import { useInView } from 'react-intersection-observer'; // Import useInView
import { Link } from 'react-router-dom'; // Import Link

const blogs = [
  {
    id: 1,
    title: "How to Optimize Shipping Routes for Efficiency",
    date: "September 10, 2024",
    image: "images/blog1.jpeg",
    excerpt: "Learn how to optimize your shipping routes to reduce costs and improve delivery times.",
  },
  {
    id: 2,
    title: "The Future of Logistics with AI and Automation",
    date: "August 25, 2024",
    image: "images/blog2.jpeg",
    excerpt: "Discover how AI and automation are revolutionizing the logistics industry.",
  },
  // Add more blogs here...
];
const whatsappUrl = `https://wa.me/9040170727?text=Hello, I would like to inquire about your services."`;
    

const Blogs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="font-inter text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        {/* Background Image with subtle zoom effect */}
        <img
          src="images/truck.jpg"
          alt="Blogs Background"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center justify-center px-4 md:px-20">
          <div className="max-w-4xl text-center">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg animate-hero-text">
              Our Latest <span className="text-green-400">Insights</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mt-4 max-w-2xl mx-auto animate-fade-in-up-delayed" style={{animationDelay: '0.4s'}}>
              Stay informed with our articles on logistics trends, shipping tips, and industry news.
            </p>
          </div>
        </div>
      </div>
      
      {/* Blog Grid Section */}
      <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16 md:mb-24">
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Knowledge Hub</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Explore Our <span className="text-green-600">Blogs</span></h2>
            <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {blogs.map((blog, index) => (
              <div 
                key={blog.id} 
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`group bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform transition-all duration-700 hover:shadow-2xl hover:shadow-green-300/40 hover:-translate-y-1 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                <div className="h-52 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"/>
                </div>
                <div className="p-6 md:p-8 text-left">
                  <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">{blog.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-5">{blog.excerpt}</p>
                  <Link to={`/blog/${blog.id}`} className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors">
                    Read More 
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center gap-4">
          <button className="py-3 px-6 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Previous
          </button>
          <span className="text-lg font-medium text-gray-700">Page 1 of 1</span>
          <button className="py-3 px-6 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center gap-2">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Blogs;

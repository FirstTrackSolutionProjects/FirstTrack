import React from 'react';
// Image component is not used in the current version of the Blogs page, so it can be removed
// import Image from '../Components/Image'; 

const blogs = [
  {
    id: 1,
    title: "How to Optimize Shipping Routes for Efficiency",
    date: "September 10, 2024",
    image: "images/blog1.jpeg",
    excerpt: "Learn how to optimize your shipping routes to reduce costs and improve delivery times.",
    link: "#" // Added a dummy link for demonstration
  },
  {
    id: 2,
    title: "The Future of Logistics with AI and Automation",
    date: "August 25, 2024",
    image: "images/blog2.jpeg",
    excerpt: "Discover how AI and automation are revolutionizing the logistics industry.",
    link: "#" // Added a dummy link for demonstration
  },
  {
    id: 3,
    title: "Navigating Global Supply Chain Disruptions",
    date: "August 15, 2024",
    image: "images/blog3.jpeg",
    excerpt: "Strategies for businesses to mitigate risks and maintain resilience in their supply chains.",
    link: "#" // Added a dummy link for demonstration
  },
  {
    id: 4,
    title: "Sustainable Logistics: Eco-Friendly Practices",
    date: "July 30, 2024",
    image: "images/blog4.jpeg",
    excerpt: "Explore how adopting sustainable practices can benefit both the planet and your bottom line.",
    link: "#" // Added a dummy link for demonstration
  },
  {
    id: 5,
    title: "Last-Mile Delivery Innovations: What's Next?",
    date: "July 10, 2024",
    image: "images/blog5.jpeg",
    excerpt: "A deep dive into the latest technologies and strategies transforming last-mile delivery.",
    link: "#" // Added a dummy link for demonstration
  },
  {
    id: 6,
    title: "The Role of Data Analytics in Modern Logistics",
    date: "June 25, 2024",
    image: "images/blog6.jpeg",
    excerpt: "Understanding how data-driven insights are crucial for optimizing logistics operations.",
    link: "#" // Added a dummy link for demonstration
  },
];
const whatsappUrl = `https://wa.me/9040170727?text=Hello, I would like to inquire about your services.`; // Removed extra double quote
    

const Blogs = () => {
  return (
    <div className="font-sans text-gray-900 bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[250px] md:h-[450px] overflow-hidden">
      {/* Background Image with subtle gradient overlay */}
      <img
        src="images/truck.jpg" // Replace with your image URL
        alt="Blogs Background"
        className="w-full h-full object-cover brightness-75" // Slightly darken image
      />

      {/* Full-width background with centered text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-4 text-center">
        <h1 className="text-white text-4xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg animate-fade-in-up">
          Our Blogs
        </h1>
        <p className="text-white text-lg md:text-xl mt-4 max-w-2xl hidden md:block opacity-0 animate-fade-in-up-delay">
            Insights, trends, and expert advice on logistics and supply chain management.
        </p>
      </div>
    </div>
      

      {/* Blog Grid Section */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Articles</h2>
            <p className="mt-4 text-lg text-gray-600">Stay up-to-date with our expert insights and industry news.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {blogs.map((blog) => (
              <div key={blog.id} 
                   className="bg-white shadow-xl rounded-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out group">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-6 md:p-8">
                  <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {blog.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">{blog.excerpt}</p>
                  <a href={blog.link} 
                     className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 group">
                    Read More 
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-10 md:py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center items-center space-x-2">
          <button className="py-2 px-4 md:px-5 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span className="text-lg font-medium text-gray-700 px-3">Page 1 of 1</span>
          <button className="py-2 px-4 md:px-5 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </section>

      
    </div>
  );
};

export default Blogs;

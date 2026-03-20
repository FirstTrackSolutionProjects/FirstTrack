import React from 'react';
import { FaFacebookSquare, FaInstagramSquare, FaYoutubeSquare, FaLinkedin, FaTwitterSquare } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FaWhatsapp } from "react-icons/fa6"; // Using FaWhatsapp from react-icons/fa6 consistently

const ContactUs = () => {
  return (
    <div className="font-inter text-gray-800 p-3 md:p-0 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <img
          src="images/contact.jpg" // Replace with your image URL
          alt="Contact Us Background"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Full-width background with centered text and subtle gradient */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600/40 to-black/50">
          <h1 className="text-white text-4xl md:text-7xl font-extrabold text-center drop-shadow-lg leading-tight">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="p-8 bg-white rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Get In Touch!</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-1">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  className="mt-1 block w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none"
                  placeholder="Your Phone Number"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-800 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="mt-1 block w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none"
                  placeholder="Subject of your message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-1">Message</label>
                <textarea
                  id="message"
                  className="mt-1 block w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none"
                  rows="6"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Contact Information</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              We'd love to hear from you! Whether you have a question, need support, or just want to connect, feel free to reach out.
            </p>
            <ul className="space-y-5 text-gray-700 text-lg">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 text-2xl mr-4 mt-1 flex-shrink-0" />
                <span>BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007.</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="text-blue-600 text-2xl mr-4 flex-shrink-0" />
                <span>+91-8240742313</span>
              </li>
              <li className="flex items-center">
                {/* Using FaWhatsapp from react-icons/fa6 for consistency */}
                <FaWhatsapp className="text-green-600 text-3xl mr-4 flex-shrink-0" />
                <span>+91-9040170727</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-2xl mr-4 flex-shrink-0" />
                <span>info@firsttrack.site</span>
              </li>
            </ul>
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-5">Follow Us On:</h3>
              <div className="flex space-x-5 mt-4">
                <a href="#" className="text-blue-700 hover:text-blue-800 transform hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Facebook">
                  <FaFacebookSquare className='w-9 h-9'/>
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-700 transform hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Instagram">
                  <FaInstagramSquare className='w-9 h-9'/>
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600 transform hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Twitter">
                  <FaTwitterSquare className='w-9 h-9'/>
                </a>
                <a href="#" className="text-red-600 hover:text-red-700 transform hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="YouTube">
                  <FaYoutubeSquare className='w-9 h-9'/>
                </a>
                <a href="#" className="text-blue-800 hover:text-blue-900 transform hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="LinkedIn">
                  <FaLinkedin className='w-9 h-9'/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">Our Location</h2>
          <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl border-4 border-white transition-all duration-300 hover:shadow-2xl">
            <iframe
              src="https://maps.google.com/maps?q=First%20Track&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919040170727?text=Hello%20I%20am%20interested%20in%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-lg z-50 transition-transform duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8 group-hover:rotate-6 transition-transform duration-300" />
      </a>
    </div>
  );
};

export default ContactUs;

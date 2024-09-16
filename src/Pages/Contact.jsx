import React from 'react';
import { FaFacebookSquare,FaInstagramSquare,FaYoutubeSquare , FaLinkedin, FaTwitterSquare} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {faTwitterSquare } from '@fortawesome/free-brands-svg-icons';



const ContactUs = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-96 bg-cover bg-center bg-[url('images/contact.jpg')]">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6">Get In Touch!!</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Phone Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="5"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="p-6 bg-blue-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <p className="text-gray-600 mb-4">Feel free to reach out to us!</p>
            <ul className="space-y-4">
              <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mr-3" />
                <span>Address : 123 Logistics Avenue, Shipping City, Country</span>
              </li>
              <li>
              <FontAwesomeIcon icon={faPhone} className="text-blue-500 mr-3" />
                <span>Phone : +123 456 7890</span>
              </li>
              <li>
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 mr-3" />
                <span>Email : info@firsttrackexpress.com</span>
              </li>
            </ul>
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Follow Us On:</h3>
              <div className="flex space-x-4 mt-4">
              
                <a href="#" className="text-blue-500">
                  <FaFacebookSquare className='w-7 h-7'/>
                </a>
                <a href="#" className="text-pink-600">
                  <FaInstagramSquare className='w-7 h-7'/>
                </a>
                <a href="#" className="text-blue-500">
                  <FaTwitterSquare className='w-7 h-7'/>
                </a>
                <a href="#" className="text-red-500">
                  <FaYoutubeSquare className='w-7 h-7'/>
                </a>
                <a href="#" className="text-blue-700">
                  <FaLinkedin className='w-7 h-7'/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Our Location</h2>
          <iframe
            src="https://maps.google.com/maps?q=First%20Track%20Express&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-96 border-0 rounded-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      
    </div>
  );
};

export default ContactUs;

import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram , FaLinkedin, FaYoutube  } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa6";
const Footer =()=>{
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };
      const whatsappUrl = `https://wa.me/9040170727?text=Hello, I would like to inquire about your services."`;
    return(
        <div className="font-inter">
        {/* Call to Action */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Let’s Connect!</h3>
        <p className="text-lg mb-8 max-w-2xl mx-auto px-4">We are always ready to assist you with your logistics needs. Contact us today!</p>
        <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mx-auto w-fit px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-gray-100 hover:shadow-lg transition-all duration-300 ease-in-out">
          Get in Touch
        </a>
      </section>
            
        
        <div className="text-black bg-gray-100 w-full mt-2 h-fit">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12 font-inter">
                <div className="w-full p-4">
                    <Link to="/"><img onClick={scrollToTop} src="images/logo.svg" alt="First Track Logo" className="w-24 h-24 object-cover rounded-full mb-6"></img></Link>
                    <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    First Track delivers fast, reliable, and seamless logistics solutions, ensuring timely and secure shipments worldwide.
                    </p>
                    <Link to="/about" ><button onClick={scrollToTop} className="bg-blue-700 text-white font-medium w-fit px-5 py-2 text-center rounded-full hover:bg-blue-800 transition-colors duration-300">About Us</button></Link>
                </div>
                <div className="w-full p-4">
                <div className="text-xl font-semibold mb-6">Contact Us</div>
                    <div className="flex items-start mb-4">
                        <FaMapMarkerAlt className="h-5 w-4 mr-3 text-blue-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-sm">BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007.</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <FaPhoneAlt className="h-5 w-4 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">+91-8240742313</span>
                    </div>

                    <div className="flex items-center mb-4">
                        <FaWhatsapp className="h-5 w-4 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">+91-9040170727</span>
                    </div>
                    
                    <div className="flex items-center">
                        <FaEnvelope className="h-5 w-4 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">info@firsttrack.site</span>
                    </div>
                </div>

                <div className="w-full p-4">
                    <div className="text-xl font-semibold mb-6">Our Services</div>
                    <Link to="/services" onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">Pick & Drop</Link>
                    <Link to="/services" onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">Packaging</Link>
                    <Link to="/services" onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">International & Domestic Services</Link>
                </div>
                <div className="w-full p-4">
                    <div className="text-xl font-semibold mb-6">Quick Links</div>
                    <Link to='/faq' onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">FAQ</Link>
                    <Link to='/about' onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">About Us</Link>
                    <Link to='/blog' onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">Blog</Link>
                    <Link to='/privacy' onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">Privacy & Policy</Link>
                    <Link to='/terms' onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">Terms of Use</Link>
                    <Link to='/refund-cancel' onClick={scrollToTop} className="block my-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">Refund & Cancellation</Link>
                    <div className="text-xl font-semibold my-6">Follow Us:</div>
                    <div className="flex space-x-6 text-gray-600">
                        
                    <a href="https://www.facebook.com/share/J8N1Q5i9hVkNpB6w/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transform hover:scale-110 transition-all duration-300">
                    <FaFacebook className="h-6 w-6"/></a>
                    
                    <a href="https://x.com/Firsttrack123" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transform hover:scale-110 transition-all duration-300">
                    <FaTwitter className="h-6 w-6"/></a>

                    <a href="https://www.instagram.com/p/C1RPln-Jzds/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transform hover:scale-110 transition-all duration-300">
                    <FaInstagram className="h-6 w-6"/></a>

                    <a href="https://www.linkedin.com/in/first-track-solution-technologies-9a53482a6/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transform hover:scale-110 transition-all duration-300">
                    <FaLinkedin className="h-6 w-6"/></a>

                    <a href="https://www.youtube.com/@FirstTrackSolutionTechnologies?si=dhN3TWFsW1m4QsZm" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transform hover:scale-110 transition-all duration-300">
                    <FaYoutube className="h-6 w-6"/></a>
                    </div>
                </div>
            </div>
            <div className="bg-gray-900 justify-between text-gray-300 text-sm flex-col md:flex-row flex items-center p-8">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <span className="text-gray-400">Copyright &copy; 2024 </span><span className="font-bold text-white"> First Track Solution Technologies. All rights reserved</span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2">
                <Link to='/' onClick={scrollToTop} className="hover:text-white transition-colors duration-200">Home</Link>
                <span className="hidden md:inline">|</span>
                <Link to='/contact' onClick={scrollToTop} className="hover:text-white transition-colors duration-200">Contact Us</Link>
                <span className="hidden md:inline">|</span>
                <Link to='/about' onClick={scrollToTop} className="hover:text-white transition-colors duration-200">About Us</Link>
                <span className="hidden md:inline">|</span>
                <Link to='/privacy' onClick={scrollToTop} className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
                <span className="hidden md:inline">|</span>
                <Link to='/terms' onClick={scrollToTop} className="hover:text-white transition-colors duration-200">Terms Of Use</Link>
                </div>
                
            </div>
            
        </div>
        </div>
    )
}

export default Footer;
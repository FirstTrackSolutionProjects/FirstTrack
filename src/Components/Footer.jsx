import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram , FaLinkedin, FaYoutube  } from 'react-icons/fa';
import { Link } from "react-router-dom";
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
      <section className="py-12 bg-blue-900 text-white text-center">
        <h3 className="text-2xl font-semibold">Let’s Connect!</h3>
        <p className="mt-4">We are always ready to assist you with your logistics needs. Contact us today!</p>
        <button className="mt-6 px-6 py-3 bg-white text-blue-500 rounded-lg hover:bg-gray-100">
          Get in Touch
        </button>
      </section>
            
        
        <div className="text-black bg-gradient-to-r from-gray-50 to-gray-300 w-full mt-2 h-fit">
            <div className="grid md:grid-cols-4  font-inter ">
                <div className="w-full h-full items-center justify-center p-7 my-auto">
                    <Link to="/"><img onClick={scrollToTop} src="images/logo-removebg.png" className="w-24 h-24 object-cover rounded-full"></img></Link>
                    <div className="text-balance font-inter text-sm my-5">
                    First Track Express delivers fast, reliable, and seamless logistics solutions, ensuring timely and secure shipments worldwide.
                    </div>
                    <Link to="/about" ><div onClick={scrollToTop} className="bg-gray-600 text-white font-bold w-28 p-3 text-center rounded-full">About Us</div></Link>
                </div>
                <div className="w-full h-full items-center justify-center my-auto p-7">
                <div className="text-xl font-semibold mb-4">Contact Us</div>
                    <div className="flex items-center mb-4 text-balance">
                        <FaMapMarkerAlt className="h-6 w-6 mr-3" />
                        <span className=" text-sm">BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <FaPhoneAlt className="h-5 w-4 mr-3" />
                        <span className="text-sm">Phone: +91-9040170727</span>
                    </div>
                    
                    <div className="flex items-center">
                        <FaEnvelope className="h-5 w-4 mr-3" />
                        <span className="text-justify text-sm">Email: info@firsttrackexpress.com</span>
                    </div>
                </div>

                <div className="w-full h-full items-center justify-center my-auto p-7">
                    <div className="text-xl font-semibold mb-4">Our Services</div>
                    <Link to="/services" onClick={scrollToTop}><div className="my-2 text-sm">E-Commerce Delivery</div></Link>
                    <Link to="/services" onClick={scrollToTop}><div className="my-2 text-sm">Pick & Drop</div></Link>
                    <Link to="/services" onClick={scrollToTop}><div className="my-2 text-sm">Packaging</div></Link>
                    <Link to="/services" onClick={scrollToTop}><div className="my-2 text-sm">International & Domestic Services</div></Link>
                </div>
                <div className="w-full h-full items-center justify-center my-auto p-7">
                    <div className="text-xl font-semibold mb-4">Quick Links</div>
                    <div><Link to='/faq' onClick={scrollToTop} className="my-2 text-sm">FAQ</Link></div>
                    <div><Link to='/about' onClick={scrollToTop} className="my-2 text-sm">About Us</Link></div>
                    <div><Link to='/blog' onClick={scrollToTop} className="my-2 text-sm">Blog</Link></div>
                    <div><Link to='/privacy' onClick={scrollToTop} className="my-2 text-sm">Privacy & Policy</Link></div>
                    <div><Link to='/terms' onClick={scrollToTop} className="my-2 text-sm">Terms of Use</Link></div>
                    <div className="text-xl font-semibold my-4">Follow Us:</div>
                    <div className="flex justify-evenly">
                        
                    <a href="https://www.facebook.com/people/Firsttrack-Solutiontechnologies/pfbid0wn8Bk27pnv2nDpGxJNg1vWLM1ssykjyHBtj4iiJWeaaTwkJz3QMYi7rUoEjutrrl/" target="_blank" rel="noopener noreferrer" >
                    <FaFacebook className="h-6 w-6"/></a>
                    
                    <a href="https://x.com/Firsttrack123" target="_blank" rel="noopener noreferrer" >
                    <FaTwitter className="h-6 w-6"/></a>

                    <a href="https://www.instagram.com/p/C1RPln-Jzds/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" >
                    <FaInstagram className="h-6 w-6"/></a>

                    <a href="https://www.linkedin.com/in/first-track-solution-technologies-9a53482a6/" target="_blank" rel="noopener noreferrer" >
                    <FaLinkedin className="h-6 w-6"/></a>

                    <a href="https://www.youtube.com/@FirstTrackSolutionTechnologies?si=dhN3TWFsW1m4QsZm" target="_blank" rel="noopener noreferrer" >
                    <FaYoutube className="h-6 w-6"/></a>

                    
                    
                    
                    
                    </div>
                </div>
            </div>
            <div className="bg-black justify-between text-white text-sm flex-1 md:flex p-8">
                <div><span className="text-gray-400">Copyright &copy; 2022 </span><span className="font-bold"> First Track Solution Technologies. All Rights Reserved.</span></div>

                <div className=" mt-5 md:mt-0 md:flex mr-10">
                <Link to='/' onClick={scrollToTop} className="">Home&nbsp; |&nbsp;</Link>
                <Link to='/contact' onClick={scrollToTop} className="md:mx-1">Contact Us&nbsp;  |&nbsp;</Link>
                <Link to='/about' onClick={scrollToTop} className="md:mx-1">About Us&nbsp;  |&nbsp;</Link>
                <Link to='/privacy' onClick={scrollToTop} className="md:mx-1">Privacy Policy&nbsp;  |&nbsp;</Link>
                <Link to='/terms' onClick={scrollToTop} className="md:mx-1">Terms Of Use</Link>
                </div>
                
            </div>
            
        </div>
        </div>
    )
}

export default Footer;
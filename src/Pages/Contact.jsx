import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FaWhatsapp } from "react-icons/fa6";
import { useInView } from 'react-intersection-observer';
import sendContactEmailService from '../services/sendContactEmailService';

const INITIAL_FORM = { name: '', email: '', mobile: '', subject: '', message: '' };

const ContactUs = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, mobile, subject, message } = form;

        if (!name || !email || !mobile || !subject || !message) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await sendContactEmailService(name, email, mobile, subject, message);
            if (res?.status === 200) {
                setSuccess('Your message has been sent successfully! We\'ll get back to you soon.');
                setForm(INITIAL_FORM);
            } else {
                setError(res?.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="font-inter text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        {/* Background Image with subtle zoom effect */}
        <img
          src="images/contact.jpg"
          alt="Contact Us Background"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center justify-center px-4 md:px-20">
          <div className="max-w-4xl text-center">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg animate-hero-text">
              Get In <span className="text-green-400">Touch</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mt-4 max-w-2xl mx-auto animate-fade-in-up-delayed" style={{animationDelay: '0.4s'}}>
              We're here to help! Reach out to us for any queries or support.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="mb-16 md:mb-24">
                <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Reach Out</span>
                <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Connect With <span className="text-green-600">Our Team</span></h2>
                <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
                {/* Contact Form */}
                <div
                    style={{ transitionDelay: `0ms` }}
                    className={`bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-700 hover:shadow-2xl hover:shadow-green-300/40 hover:-translate-y-1 ${
                        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Send Us a <span className="text-green-600">Message</span></h3>

                    {/* Success Banner */}
                    {success && (
                        <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            {success}
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-300 placeholder-gray-500"
                        placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-300 placeholder-gray-500"
                        placeholder="Your Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="sr-only">Phone</label>
                        <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-300 placeholder-gray-500"
                        placeholder="Your Phone Number"
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="sr-only">Subject</label>
                        <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-300 placeholder-gray-500"
                        placeholder="Subject"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="sr-only">Message</label>
                        <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-300 placeholder-gray-500"
                        rows="6"
                        placeholder="Your Message"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-8 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                Sending…
                            </>
                        ) : (
                            <>
                                Send Message
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </>
                        )}
                    </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div
                    style={{ transitionDelay: `150ms` }}
                    className={`bg-green-50 p-8 md:p-12 rounded-3xl shadow-xl shadow-green-200/50 border border-green-100 transform transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-300/40 hover:-translate-y-1 text-left ${
                        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-green-800 mb-6">Our <span className="text-gray-900">Information</span></h3>
                    <p className="text-gray-700 text-lg mb-8">Feel free to reach out to us through any of the contact methods below!</p>
                    <ul className="space-y-6 text-gray-700">
                    <li className="flex items-start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600 text-xl mr-4 flex-shrink-0 mt-1" />
                        <span className="text-lg">BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007.</span>
                    </li>
                    <li className="flex items-center">
                        <FontAwesomeIcon icon={faPhone} className="text-green-600 text-xl mr-4 flex-shrink-0" />
                        <span className="text-lg">+91-8240742313</span>
                    </li>
                    <li className="flex items-center">
                        <FaWhatsapp className="text-green-600 text-2xl mr-4 flex-shrink-0" />
                        <span className="text-lg">+91-9040170727</span>
                    </li>
                    <li className="flex items-center">
                        <FontAwesomeIcon icon={faEnvelope} className="text-green-600 text-xl mr-4 flex-shrink-0" />
                        <span className="text-lg">info@firsttrack.site</span>
                    </li>
                    </ul>
                    <div className="mt-12 pt-8 border-t border-green-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-5">Follow Us On:</h3>
                        <div className="flex space-x-5 justify-center sm:justify-start">
                            <a href="https://www.facebook.com/share/J8N1Q5i9hVkNpB6w/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transform hover:scale-110 transition-all duration-300">
                                <FaFacebook className='w-8 h-8'/>
                            </a>
                            <a href="https://www.instagram.com/p/C1RPln-Jzds/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transform hover:scale-110 transition-all duration-300">
                                <FaInstagram className='w-8 h-8'/>
                            </a>
                            <a href="https://x.com/Firsttrack123" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transform hover:scale-110 transition-all duration-300">
                                <FaTwitter className='w-8 h-8'/>
                            </a>
                            <a href="https://www.youtube.com/@FirstTrackSolutionTechnologies?si=dhN3TWFsW1m4QsZm" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transform hover:scale-110 transition-all duration-300">
                                <FaYoutube className='w-8 h-8'/>
                            </a>
                            <a href="https://www.linkedin.com/in/first-track-solution-technologies-9a53482a6/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transform hover:scale-110 transition-all duration-300">
                                <FaLinkedin className='w-8 h-8'/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="mb-16 md:mb-24">
                <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Find Us</span>
                <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 leading-tight">Our <span className="text-green-600">Location</span></h2>
                <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full"></div>
            </div>
          <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
            <iframe
              src="https://maps.google.com/maps?q=First%20Track&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              title="Our Location on Google Maps"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button (Only for Contact Page) */}
            <a
              href="https://wa.me/919040170727?text=Hi%20First%20Track%20Logistics,%20I'm%20interested%20in%20learning%20more%20about%20your%20fast%20and%20reliable%20shipping%20solutions.%20Please%20connect%20me%20with%20a%20representative.%20Thank%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-40 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform duration-300 hover:scale-110"
              aria-label="Chat with us on WhatsApp"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
    </div>
  );
};

export default ContactUs;

import React from 'react';

const AboutUs = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-96 bg-cover
       bg-center bg-[url('images/FTEXPRESS.png')]">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
            About Us
          </h1>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="text-blue-500 mb-4">
              <i className="fas fa-shipping-fast text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="mt-4 text-gray-600">To deliver the best logistics solutions with unparalleled customer service.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="text-blue-500 mb-4">
              <i className="fas fa-globe text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold">Our Vision</h3>
            <p className="mt-4 text-gray-600">Connecting the world through fast, reliable, and efficient shipping services.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="text-blue-500 mb-4">
              <i className="fas fa-handshake text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold">Our Values</h3>
            <p className="mt-4 text-gray-600">Integrity, innovation, and customer-first solutions in every delivery.</p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold">Our Services</h2>
          <p className="text-gray-600 mt-4">Offering a wide range of logistics solutions tailored to your needs.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Example Service Card */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-blue-500 mb-4">
              <i className="fas fa-plane text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold">Air Freight</h3>
            <p className="mt-4 text-gray-600">Fast and reliable air freight solutions for your business needs.</p>
          </div>
          {/* Add other service cards in similar format */}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Example Team Member */}
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <img
              src="/path-to-team-member-photo.jpg"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-xl font-semibold">John Doe</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </div>
          {/* Add other team members similarly */}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold">Why Choose Us</h2>
          <p className="text-gray-600 mt-4">We provide the best solutions for all your logistics needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Example Reason */}
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="text-blue-500 mb-4">
              <i className="fas fa-check-circle text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold">Reliability</h3>
            <p className="mt-4 text-gray-600">On-time, every time, ensuring you can trust us with your deliveries.</p>
          </div>
          {/* Add other reasons similarly */}
        </div>
      </section>

     
    </div>
  );
};

export default AboutUs;

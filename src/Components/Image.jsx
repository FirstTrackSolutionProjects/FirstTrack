import React from 'react';
import { Link } from 'react-router-dom';

const Image = () => {
  return (
    <section className="z-0 relative w-full h-[400px] md:h-[480px] bg-cover bg-center bg-[url('images/banner.png')]">
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Tagline */}
          <div className="text-white">
            <h1 className="w-1/2 text-2xl md:text-4xl  font-bold mb-6">
              YOUR TRUSTED LOGISTIC <span className='text-gray-700'>PARTNER</span> IN WORLDWIDE SMART WAY
            </h1>
            {/* Buttons */}
            <div className="space-x-4">
              <button className="bg-gray-700 text-sm md:text-base text-white py-3 px-6 rounded-lg transition duration-300">
                DISCOVER MORE
              </button>
              <Link to="/"><button className="bg-white text-sm md:text-base text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
                LOGIN
              </button></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Image;

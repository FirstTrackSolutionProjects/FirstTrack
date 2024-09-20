import React from 'react';
import { Link } from 'react-router-dom';

const Image = () => {
  return (
    <>
    <div className="relative w-full h-[400px] md:h-[480px] p-2">
    {/* Background Image */}
    <img
      src="images/banner.png" // Replace with your image URL
      alt="Background"
      className="w-full h-full object-cover" // Image with reduced opacity (dull)
    />
    
    {/* Text Overlay */}
    <div className="absolute inset-0  flex items-center justify-center">
      <h1 className="text-white text-3xl  bg-black bg-opacity-30 h-[400px] md:h-[480px] w-full px-4 py-2 rounded">
      <div className="max-w-6xl my-20 md:my-32 mx-auto md:px-8">
            <h1 className="w-1/2 items-center text-2xl md:text-4xl  font-bold mb-6">
              YOUR TRUSTED LOGISTIC <span className='text-gray-700'>PARTNER</span> IN WORLDWIDE SMART WAY
            </h1>
            {/* Buttons */}
            <div className="space-x-4">
              <button className="bg-gray-700 text-sm md:text-base text-white py-3 px-6 rounded-lg transition duration-300">
                DISCOVER MORE
              </button>
              <Link to="/login"><button className="bg-white text-sm md:text-base text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
                LOGIN
              </button></Link>
            </div>
            </div>
      </h1>
    </div>
  </div>
  </>
  );
};

export default Image;


import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeroAction = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative z-20 w-full -mt-16 md:-mt-20 mb-20 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-12 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm bg-white/95 transition-all duration-500 hover:shadow-3xl hover:border-green-100">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">Ready to ship your first package?</h3>
          <p className="text-gray-600 text-lg font-medium">Join 2,500+ businesses growing with First Track.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link to="/about" className="w-full sm:w-auto">
            <button className="w-full bg-gray-900 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 border border-gray-900">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </Link>

          {isAuthenticated ? (
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="w-full bg-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-green-500/20 hover:bg-green-700 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 border border-green-600">
                DASHBOARD
              </button>
            </Link>
          ) : (
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full bg-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-green-500/20 hover:bg-green-700 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 border border-green-600">
                GET STARTED
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroAction;

// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const HeroAction = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center text-center overflow-hidden rounded-2xl shadow-lg my-10">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] ease-in-out scale-105"
//         style={{
//           backgroundImage: `url('images/banner.png')`,
//         }}
//       ></div>

//       {/* Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

//       {/* Text and Buttons */}
//       <div
//         className="relative z-10 flex flex-col items-center justify-center text-white"
//         style={{
//           animation: "fadeInUp 1.2s ease-out",
//         }}
//       >
//         <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-wide">
//           Empowering Global Logistics with Speed & Trust
//         </h1>
//         <p className="text-gray-200 max-w-2xl mb-8 px-6 text-sm md:text-base">
//           From local deliveries to worldwide shipping — experience seamless,
//           smart logistics designed for your business success.
//         </p>

//         <div className="flex justify-center space-x-4">
//           <button className="bg-red-600 text-sm md:text-base text-white py-3 px-6 rounded-lg transition duration-300 hover:bg-red-700 hover:scale-105 shadow-lg">
//             DISCOVER MORE
//           </button>

//           {isAuthenticated ? (
//             <Link to="/dashboard">
//               <button className="bg-white text-sm md:text-base text-gray-700 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition duration-300">
//                 DASHBOARD
//               </button>
//             </Link>
//           ) : (
//             <Link to="/login">
//               <button className="bg-white text-sm md:text-base text-gray-700 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition duration-300">
//                 LOGIN
//               </button>
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Inline Keyframes */}
//       <style>{`
//         @keyframes fadeInUp {
//           0% { opacity: 0; transform: translateY(30px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HeroAction;

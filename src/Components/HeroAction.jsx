
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeroAction = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full text-center mt-6 mb-10">
      <div className="flex justify-center space-x-4">
        <button className="bg-gray-700 text-sm md:text-base text-white py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-800">
          DISCOVER MORE
        </button>

        {isAuthenticated ? (
          <Link to="/dashboard">
            <button className="bg-white text-sm md:text-base text-gray-700 py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition duration-300">
              DASHBOARD
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="bg-green-500 text-sm md:text-base text-gray-700 py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition duration-300">
              LOGIN
            </button>
          </Link>
        )}
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

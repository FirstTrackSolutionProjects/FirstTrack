import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Keep useLocation for potential future use or context
import { FaHome, FaCompass, FaMoneyBillAlt, FaEnvelope, FaUser } from 'react-icons/fa'; // Icons for navigation
import { useAuth } from '../context/AuthContext'; // Import useAuth

const BottomNavbar = () => {
  // const location = useLocation(); // Not directly used in this component's render, but kept for context if needed.
  const { isAuthenticated } = useAuth(); // Use the auth context

  // Helper function for NavLink styling
  const getNavLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center py-2.5 px-3 text-xs font-medium transition-colors duration-200 rounded-md
     ${isActive
        ? 'bg-green-50 text-green-700' // Stronger active background
        : 'text-gray-600 hover:text-green-700 hover:bg-gray-50' // Improved hover state
    }`;

  return (
    <nav 
      className="fixed bottom-0 left-0 w-full bg-white shadow-lg md:hidden z-50 border-t border-gray-200 pb-[env(safe-area-inset-bottom)]" // Adjusted z-index for higher visibility
      aria-label="Main mobile navigation" // Added aria-label for accessibility
    >
      <div className="flex justify-evenly items-center h-[72px]"> {/* Increased height for better tap targets, changed to justify-evenly */}
        <NavLink to="/" className={getNavLinkClass} title="Home"> {/* Added title for better UX */}
          <FaHome className="w-5 h-5 mb-1" aria-hidden="true" /> {/* Added aria-hidden */}
          <span>Home</span>
        </NavLink>
        <NavLink to="/track" className={getNavLinkClass} title="Track Shipment">
          <FaCompass className="w-5 h-5 mb-1" aria-hidden="true" /> {/* Added aria-hidden */}
          <span>Track</span>
        </NavLink>
        {/* 'Blogs' link removed as per request - Ensure it's also not routed in App.jsx if truly removed */}
        <NavLink to="/pricing" className={getNavLinkClass} title="Pricing">
          <FaMoneyBillAlt className="w-5 h-5 mb-1" aria-hidden="true" /> {/* Added aria-hidden */}
          <span>Pricing</span>
        </NavLink>
        <NavLink to="/contact" className={getNavLinkClass} title="Contact Us">
          <FaEnvelope className="w-5 h-5 mb-1" aria-hidden="true" /> {/* Added aria-hidden */}
          <span>Contact</span>
        </NavLink>
        {/* Conditional Dashboard/Account button */}
        {isAuthenticated ? (
          <NavLink to="/dashboard" className={getNavLinkClass} title="Dashboard">
            <FaUser className="w-5 h-5 mb-1" aria-hidden="true" /> {/* Added aria-hidden */}
            <span>Dashboard</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className={getNavLinkClass} title="Account Login">
            <FaUser className="w-5 h-5 mb-1" aria-hidden="true" /> {/* Added aria-hidden */}
            <span>Account</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNavbar;
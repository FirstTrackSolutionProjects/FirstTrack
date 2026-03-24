import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaMoneyBillAlt, FaEnvelope, FaUser } from 'react-icons/fa'; // Icons for navigation
import { useAuth } from '../context/AuthContext'; // Import useAuth

const BottomNavbar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // Use the auth context

  const getNavLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors duration-200
     ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg md:hidden z-50 border-t border-gray-200"> {/* Increased z-index to 50 */}
      <div className="flex justify-around items-center h-14">
        <NavLink to="/" className={getNavLinkClass}>
          <FaHome className="w-5 h-5 mb-1" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/track" className={getNavLinkClass}>
          <FaCompass className="w-5 h-5 mb-1" />
          <span>Track</span>
        </NavLink>
        {/* 'Blogs' link removed as per request */}
        <NavLink to="/pricing" className={getNavLinkClass}>
          <FaMoneyBillAlt className="w-5 h-5 mb-1" />
          <span>Pricing</span>
        </NavLink>
        <NavLink to="/contact" className={getNavLinkClass}>
          <FaEnvelope className="w-5 h-5 mb-1" />
          <span>Contact</span>
        </NavLink>
        {/* Conditional Dashboard/Account button */}
        {isAuthenticated ? (
          <NavLink to="/dashboard" className={getNavLinkClass}>
            <FaUser className="w-5 h-5 mb-1" />
            <span>Dashboard</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className={getNavLinkClass}>
            <FaUser className="w-5 h-5 mb-1" />
            <span>Account</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNavbar;
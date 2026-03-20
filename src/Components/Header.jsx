import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // Menu icon
import { IoMdClose } from 'react-icons/io'; // Close icon
import { Link, useLocation, NavLink } from 'react-router-dom'; // Added NavLink
import { useAuth } from '../context/AuthContext';
import { FaDoorOpen } from 'react-icons/fa';
import WalletRechargeModal from './WalletRechargeModal';
import { FaWallet } from 'react-icons/fa'; // Added Wallet icon

const API_URL = import.meta.env.VITE_APP_API_URL;

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, name, logout, verified } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);

  const closeRechargeModal = () => {
    setShowRecharge(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [balance, setBalance] = useState(0.00);

  // Helper function to format balance for display (e.g., 1.5K, 12.3L, 1.2Cr)
  const formatBalance = (num) => {
    if (typeof num !== 'number' || isNaN(num)) {
      return '0.00';
    }
    const absNum = Math.abs(num);

    if (absNum < 1000) {
      return num.toFixed(2);
    }
    if (absNum >= 10000000) { // Crores (1 Crore = 10,000,000)
      return (num / 10000000).toFixed(1) + 'Cr';
    }
    if (absNum >= 100000) { // Lakhs (1 Lakh = 100,000)
      return (num / 100000).toFixed(1) + 'L';
    }
    if (absNum >= 1000) { // Thousands
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(2); // Fallback for very small numbers, though already covered
  };

  useEffect(() => {
    const fetchBalance = async () => {
      // console.log("Fetching balance"); // Removed console.log
      try {
        const response = await fetch(`${API_URL}/wallet/balance`, {
          method: 'POST',
          headers: {
            "Authorization": localStorage.getItem("token"),
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // console.log(result); // Removed console.log
        if (result && result.balance !== undefined) {
          // Ensure balance is always a number. Parse it and default to 0.00 if parsing fails.
          const parsedBalance = parseFloat(result.balance);
          setBalance(isNaN(parsedBalance) ? 0.00 : parsedBalance);
        } else {
          // If result or result.balance is missing, ensure the state is reset to a numeric default.
          setBalance(0.00);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        // Optionally, set balance to 0 or display an error message
      }
    };
    if (isAuthenticated && verified) {
      fetchBalance();
    }
  }, [isAuthenticated, verified]); // Added verified to dependency array

  // Helper for NavLink styling (desktop)
  const getNavLinkClass = ({ isActive }) =>
    `relative font-medium py-2 px-1 text-gray-700 hover:text-green-600 transition-colors duration-200
     ${isActive ? 'text-green-700 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[3px] after:bg-green-700 after:rounded-full after:transition-all after:duration-300 after:scale-x-100' :
      'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-full after:h-[3px] after:bg-green-700 after:rounded-full after:transition-all after:duration-300'}`;

  // Helper for mobile NavLink styling
  const getMobileNavLinkClass = ({ isActive }) =>
    `block py-2 px-4 rounded-lg hover:bg-green-100 transition-colors duration-200 ${isActive ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'}`;

  return (
    <>
      {showRecharge ? <WalletRechargeModal onClose={closeRechargeModal} /> : null}



      <header className="bg-white shadow-sm w-full font-inter sticky top-0 z-30"> {/* Changed bg-gray-100 to bg-white, added sticky and z-30, shadow-md to shadow-sm */}
        {/* Container for logo and navigation */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center py-2 md:py-3"> {/* Adjusted padding */}
          {/* Logo and Company Name */}
          <Link to='/' className="flex items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
            <img src="/images/logo.svg" alt="First Track Logistics Logo" className="w-12 h-12 md:w-14 md:h-14" /> {/* Adjusted logo size */}
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold ml-2 text-gray-800">FIRST <span className="text-[#4ADE80]">TRACK</span></span> {/* Adjusted text size and color */}
          </Link>

          {/* Menu for md and above */}
          <nav className="hidden md:flex flex-grow justify-center">
            <div className="space-x-8 text-base"> {/* Increased space-x */}
              <NavLink to="/" className={getNavLinkClass}>HOME</NavLink>
              <NavLink to="/track" className={getNavLinkClass}>TRACKING</NavLink>
              <NavLink to="/blog" className={getNavLinkClass}>BLOGS</NavLink>
              <NavLink to="/pricing" className={getNavLinkClass}>PRICING</NavLink>
              <NavLink to="/about" className={getNavLinkClass}>ABOUT</NavLink>
              <NavLink to="/contact" className={getNavLinkClass}>CONTACT</NavLink>
            </div>
          </nav>

          {/* Right section for authenticated users / menu button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Balance view for small screens (and potentially desktop, conditional for dashboard) */}
            {(isAuthenticated && verified && location.pathname.startsWith('/dashboard')) && (
              <div className='md:hidden'> {/* Only show on mobile */}
                <div
                  onClick={() => setShowRecharge(true)}
                  className={`relative bg-green-500 text-white flex items-center font-medium rounded-full px-3 py-1 text-sm cursor-pointer transition-all duration-200 shadow-sm
                  ${balance < 250 ? 'ring-2 ring-red-500 ring-offset-1 bg-red-500' : 'hover:scale-105'}`}
                >
                  <FaWallet className="mr-1 text-base" />
                  <p>{`₹${formatBalance(balance)}`}</p>
                  {balance < 250 && <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold animate-pulse">!</span>}
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <div className='md:flex items-center space-x-4 hidden'> {/* Authenticated user section for desktop */}
                {(verified && location.pathname.startsWith('/dashboard')) && (
                  <div
                    onClick={() => setShowRecharge(true)}
                    className={`relative bg-green-500 text-white flex items-center font-medium rounded-full px-4 py-2 cursor-pointer transition-all duration-200 shadow-sm
                    ${balance < 250 ? 'ring-2 ring-red-500 ring-offset-1 bg-red-500' : 'hover:scale-105'}`}
                  >
                    <FaWallet className="mr-2 text-lg" />
                    <p>{`₹${formatBalance(balance)}`}</p>
                    {balance < 250 && <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold animate-pulse">!</span>}
                  </div>
                )}
                <div className='flex items-center space-x-2'>
                  <NavLink to="/dashboard" className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                    {name}
                  </NavLink>
                  <button
                    className="bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white text-lg p-2 rounded-full cursor-pointer flex items-center justify-center shadow-sm"
                    onClick={logout}
                    aria-label="Logout"
                  >
                    <FaDoorOpen />
                  </button>
                </div>
              </div>
            ) : null}

            {/* Menu button for small screens */}
            <div className="md:hidden z-50"> {/* Higher z-index for menu button */}
              <button onClick={toggleSidebar} aria-label="Open menu">
                <AiOutlineMenu className='text-green-700' size={28} /> {/* Increased size */}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar for small screens */}
        <div
          className={`z-50 fixed top-0 right-0 w-64 max-w-[80vw] bg-white h-full shadow-2xl transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <div className="p-4 flex justify-end items-center border-b"> {/* Aligned close button right */}
            <button onClick={toggleSidebar} aria-label="Close menu">
              <IoMdClose size={32} className="text-gray-600 hover:text-red-500 transition-colors" /> {/* Increased size and added hover */}
            </button>
          </div>
          <div className="p-4 space-y-4">
            {isAuthenticated ? (
              <div className="flex flex-col items-start p-3 bg-green-50 rounded-lg shadow-sm">
                <div className="flex items-center justify-between w-full mb-2">
                  <NavLink
                    to="/dashboard"
                    onClick={toggleSidebar}
                    className="font-bold text-lg text-green-700 hover:text-green-800 transition-colors flex-grow"
                  >
                    Hello, {name}
                  </NavLink>
                  <button
                    className="bg-red-500 hover:bg-red-600 transition-colors text-white text-base p-2 rounded-full cursor-pointer flex items-center justify-center shadow-sm"
                    onClick={logout}
                    aria-label="Logout"
                  >
                    <FaDoorOpen />
                  </button>
                </div>
                {(verified && location.pathname.startsWith('/dashboard')) && (
                  <div
                    onClick={() => { setShowRecharge(true); toggleSidebar(); }} // Close sidebar on click
                    className={`relative bg-green-500 text-white flex items-center font-medium rounded-full px-3 py-1 text-sm cursor-pointer transition-all duration-200 shadow-sm w-full justify-center
                    ${balance < 250 ? 'ring-2 ring-red-500 ring-offset-1 bg-red-500' : 'hover:scale-105'}`}
                  >
                    <FaWallet className="mr-1 text-base" />
                    <p>{`₹${formatBalance(balance)}`}</p>
                    {balance < 250 && <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold animate-pulse">!</span>}
                  </div>
                )}
              </div>
            ) : null}
            <nav className="flex flex-col space-y-2 text-lg">
              <NavLink to="/" className={getMobileNavLinkClass} onClick={toggleSidebar}>Home</NavLink>
              <NavLink to="/track" className={getMobileNavLinkClass} onClick={toggleSidebar}>Tracking</NavLink>
              <NavLink to="/about" className={getMobileNavLinkClass} onClick={toggleSidebar}>About</NavLink>
              <NavLink to="/blog" className={getMobileNavLinkClass} onClick={toggleSidebar}>Blogs</NavLink>
              <NavLink to="/pricing" className={getMobileNavLinkClass} onClick={toggleSidebar}>Pricing</NavLink>
              <NavLink to="/contact" className={getMobileNavLinkClass} onClick={toggleSidebar}>Contact</NavLink>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // Menu icon
import { IoMdClose } from 'react-icons/io'; // Close icon
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDoorOpen } from 'react-icons/fa';
import WalletRechargeModal from './WalletRechargeModal' 

const API_URL = import.meta.env.VITE_APP_API_URL

const Header = () => {
  const location = useLocation();
  const {isAuthenticated, name, logout, verified} = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const closeRechargeModal = () => {
    setShowRecharge(false)
  }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [balance, setBalance] = useState(0.00);
  useEffect(() => {
    const fetchBalance = async () => {
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
        if (result && result.balance !== undefined) {
          const parsedBalance = parseFloat(result.balance);
          setBalance(isNaN(parsedBalance) ? 0.00 : parsedBalance);
        } else {
          setBalance(0.00);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    if (isAuthenticated && verified){
        fetchBalance();
    }
  }, [isAuthenticated, verified]);

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

      <header className="bg-white shadow-sm w-full font-inter sticky top-0 z-30">
        {/* Container for logo and navigation */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center py-2 md:py-3">
          {/* Logo and Company Name */}
          <Link to='/' className="flex items-center flex-shrink-0">
            <img src="/images/logo.svg" alt="First Track Logistics Logo" className="w-10 h-10 md:w-12 md:h-12" />
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold ml-2 text-gray-800 whitespace-nowrap">FIRST <span className="text-[#22c55e]">TRACK</span></span> {/* Updated green color to match theme */}
          </Link>

          {/* Menu for md and above */}
          <nav className="hidden md:flex flex-grow justify-center min-w-0">
            <div className="flex flex-wrap justify-center md:space-x-4 lg:space-x-8 text-base">
              <NavLink to="/" className={getNavLinkClass}>HOME</NavLink>
              <NavLink to="/track" className={getNavLinkClass}>TRACKING</NavLink>
              <NavLink to="/blog" className={getNavLinkClass}>BLOGS</NavLink>
              <NavLink to="/pricing" className={getNavLinkClass}>PRICING</NavLink>
              <NavLink to="/about" className={getNavLinkClass}>ABOUT</NavLink>
              <NavLink to="/contact" className={getNavLinkClass}>CONTACT</NavLink>
            </div>
          </nav>

          {/* Right section for authenticated users / menu button */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 min-w-0">
            {/* Balance view for small screens (and potentially desktop, conditional for dashboard) */}
            {(isAuthenticated && verified && location.pathname.startsWith('/dashboard')) && (
              <div className='md:hidden flex-shrink-0'>
                <div
                  onClick={() => setShowRecharge(true)}
                  className={`relative bg-[#22c55e] text-white flex items-center font-medium rounded-full px-3 py-1 text-sm cursor-pointer transition-all duration-200 shadow-sm whitespace-nowrap
                  ${balance < 250 ? 'ring-2 ring-red-500 ring-offset-1 bg-red-500' : 'hover:scale-105'}`}
                  aria-label={`Current balance: ₹${formatBalance(balance)}. Click to recharge.`}
                >
                  <FaWallet className="mr-1 text-base" />
                  <p>{`₹${formatBalance(balance)}`}</p>
                  {balance < 250 && <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold animate-pulse">!</span>}
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <div className='md:flex items-center space-x-4 hidden flex-shrink-0 min-w-0'> {/* Authenticated user section for desktop */}
                {(verified && location.pathname.startsWith('/dashboard')) && (
                  <div
                    onClick={() => setShowRecharge(true)}
                    className={`relative bg-[#22c55e] text-white flex items-center font-medium rounded-full px-4 py-2 cursor-pointer transition-all duration-200 shadow-sm whitespace-nowrap
                    ${balance < 250 ? 'ring-2 ring-red-500 ring-offset-1 bg-red-500' : 'hover:scale-105'}`}
                    aria-label={`Current balance: ₹${formatBalance(balance)}. Click to recharge.`}
                  >
                    <FaWallet className="mr-2 text-lg" />
                    <p>{`₹${formatBalance(balance)}`}</p>
                    {balance < 250 && <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold animate-pulse">!</span>}
                  </div>
                )}
                <div className='flex items-center space-x-2 min-w-0'>
                  <NavLink 
                    to="/dashboard" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-200 cursor-pointer truncate max-w-[120px] md:max-w-[150px]"
                    title={name}
                  >
                    {name}
                  </NavLink>
                  <button
                    className="bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white text-lg p-2 rounded-full cursor-pointer flex items-center justify-center shadow-sm flex-shrink-0"
                    onClick={logout}
                    aria-label="Logout"
                  >
                    <FaDoorOpen />
                  </button>
                </div>
              </div>
            ) : null}

            {/* Menu button for small screens */}
            <div className="md:hidden z-50 flex-shrink-0">
              <button onClick={toggleSidebar} aria-label="Open menu">
                <AiOutlineMenu className='text-[#22c55e]' size={28} /> {/* Updated green color */}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar for small screens */}
        <div
          className={`z-[100] fixed top-0 bottom-0 right-0 w-64 max-w-[80vw] bg-white shadow-2xl transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <div className="p-4 flex justify-end items-center border-b flex-shrink-0">
            <button onClick={toggleSidebar} aria-label="Close menu">
              <IoMdClose size={32} className="text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>
          <div className="p-4 space-y-4 flex-grow overflow-y-auto">
            {isAuthenticated ? (
              <div className="flex flex-col items-start p-3 bg-green-50 rounded-lg shadow-sm">
                <div className="flex items-center justify-between w-full mb-2">
                  <NavLink
                    to="/dashboard"
                    onClick={toggleSidebar}
                    className="font-bold text-lg text-green-700 hover:text-green-800 transition-colors flex-grow truncate"
                    title={name}
                  >
                    Hello, {name}
                  </NavLink>
                  <button
                    className="bg-red-500 hover:bg-red-600 transition-colors text-white text-base p-2 rounded-full cursor-pointer flex items-center justify-center shadow-sm flex-shrink-0"
                    onClick={logout}
                    aria-label="Logout"
                  >
                    <FaDoorOpen />
                  </button>
                </div>
                {(verified && location.pathname.startsWith('/dashboard')) && (
                  <div
                    onClick={() => { setShowRecharge(true); toggleSidebar(); }}
                    className={`relative bg-[#22c55e] text-white flex items-center font-medium rounded-full px-3 py-1 text-sm cursor-pointer transition-all duration-200 shadow-sm w-full justify-center whitespace-nowrap
                    ${balance < 250 ? 'ring-2 ring-red-500 ring-offset-1 bg-red-500' : 'hover:scale-105'}`}
                    aria-label={`Current balance: ₹${formatBalance(balance)}. Click to recharge.`}
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

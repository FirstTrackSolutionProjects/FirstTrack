import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import FontAwesome icons
import { menuItems } from '../Constants'; // Import sidebar items
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SidebarItem from './SidebarItem.jsx';
import WalletRechargeModal from './WalletRechargeModal.jsx';
const Sidebar2 = () => {
  const {admin, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);

  const closeRechargeModal = () => {
    setShowRecharge(false);
  }
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    if (location.pathname === "/dashboard/logout") logout(); // Use strict equality
    // Only close sidebar on navigation for mobile
    if (window.innerWidth < 768) { // Check if it's a mobile view
      setIsOpen(false);
    }
  },[navigate, location.pathname, logout]) // Added location.pathname and logout to dependencies

  const sidebarItems = menuItems
  return (
    <>
    {showRecharge ? <WalletRechargeModal onClose={closeRechargeModal} /> : null}
    <div>
      {/* Menu button (Icon) - visible only below md screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-3 absolute top-3 left-3 text-gray-700 hover:text-[#22c55e] transition-colors duration-200 z-40 bg-white rounded-full shadow-md" // Enhanced button styling
        aria-label="Open sidebar menu"
      >
        <FaBars className="h-6 w-6" /> {/* Menu icon */}
      </button>

       {/* Sidebar for md screen */}
      <div
        className="bg-[#1f2937] h-full w-64 text-white hidden md:flex flex-col left-0 shadow-2xl border-r border-gray-800" // Deeper shadow for desktop sidebar
      >
        {/* Sidebar content - scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 pt-2 custom-scrollbar" style={{scrollBehavior: 'smooth'}}>
          <div className="p-4 flex items-center justify-center border-b border-gray-700 mb-4"> {/* Added a header/branding area */}
            <img src="/images/logo3.jpg" alt="First Track Logistics Logo" className="w-8 h-8 mr-2" />
            <span className="text-xl font-extrabold text-white">FIRST <span className="text-[#22c55e]">TRACK</span></span>
          </div>
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              if ((item.admin && !admin) || (item.merchantOnly && admin)) {
                return null; // Return null explicitly for filtered items
              }
              return (<SidebarItem key={item.label || item.name} item={item} setShowRecharge={setShowRecharge} />)
            })}
          </ul>
        </div>
      </div>
       {/* Sidebar for beloe md screen */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-[#1f2937] text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex flex-col`}
        style={{boxShadow: '4px 0 20px 0 rgba(0,0,0,0.3)'}} // Stronger shadow for mobile sidebar
      >
        {/* Close button (Icon) - fixed at the top */}
        <div className="sticky top-0 left-0 z-50 bg-[#1f2937] flex justify-between items-center p-4 border-b border-gray-700"> {/* Added padding and border */}
          <div className="flex items-center">
            <img src="/images/logo-white.svg" alt="First Track Logistics Logo" className="w-8 h-8 mr-2" />
            <span className="text-xl font-extrabold text-white">FIRST <span className="text-[#22c55e]">TRACK</span></span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-red-400 focus:outline-none transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <FaTimes className="h-7 w-7" />
          </button>
        </div>
        {/* Sidebar content - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4 custom-scrollbar" style={{scrollBehavior: 'smooth'}}> {/* Increased top padding */}
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              if ((item.admin && !admin) || (item.merchantOnly && admin)) {
                return null;
              }
              return (<SidebarItem key={item.label || item.name} item={item} setShowRecharge={setShowRecharge} />)
            })}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar2;

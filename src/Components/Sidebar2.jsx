import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import FontAwesome icons
import { menuItems } from '../Constants'; // Import sidebar items
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SidebarItem from './SidebarItem.jsx';
import WalletRechargeModal from './WalletRechargeModal.jsx';
const Sidebar2 = () => {
  const {role, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const closeRechargeModal = () => {
    setShowRecharge(false);
  }
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    if (location.pathname=="/dashboard/logout") logout()
  },[navigate])

  const sidebarItems = menuItems
  return (
    <>
    {showRecharge ? <WalletRechargeModal onClose={closeRechargeModal} /> : null}
    <div className="h-full flex">
      {/* Menu button (Icon) - visible only below md screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-3 fixed top-[72px] left-4 text-white hover:text-[#22c55e] transition-colors duration-200 z-[60] bg-black/50 rounded-full shadow-lg backdrop-blur-sm"
        aria-label="Open sidebar menu"
      >
        {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-[2px]"
            onClick={toggleSidebar}
        />
      )}

       {/* Sidebar for md screen */}
       <div
        className={`${isSidebarHovered ? 'w-[250px] min-w-[250px]' : 'w-[72px] min-w-[72px]'} md:block hidden h-full relative bg-[#0f172a] overflow-y-auto overflow-x-hidden transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
      {/* Branding Section */}
      <div className={`flex items-center px-4 py-6 border-b border-gray-800/50 mb-2 transition-all duration-300 ${isSidebarHovered ? 'justify-start' : 'justify-center'}`}>
        <img src="/images/logo.svg" alt="Logo" className="w-10 h-10 flex-shrink-0" />
        {isSidebarHovered && (
          <span className="ml-3 text-lg font-extrabold text-white whitespace-nowrap animate-fadeIn">
            FIRST <span className="text-[#22c55e]">TRACK</span>
          </span>
        )}
      </div>
      <ul className="p-2">
        {sidebarItems.map((item) => {
          if (item.hidden || (item.roles !== undefined && !item.roles.includes(role))) {
            return;
          }
          return(<SidebarItem item={item} setShowRecharge={setShowRecharge} sidebarExpanded={isSidebarHovered} />)
        })}
      </ul>
      </div>
       {/* Sidebar for below md screen */}
       <div
        className={`fixed top-0 left-0 z-50 h-full bg-[#0f172a] overflow-y-auto overflow-x-hidden transition-all duration-300 ${isOpen ? 'w-[280px] shadow-2xl' : 'w-0'}`}
      >
        {/* Branding for Mobile Sidebar */}
        {isOpen && (
          <div className="flex items-center px-6 py-6 border-b border-gray-800/50 mb-2">
            <img src="/images/logo.svg" alt="Logo" className="w-10 h-10 flex-shrink-0" />
            <span className="ml-3 text-lg font-extrabold text-white whitespace-nowrap">
              FIRST <span className="text-[#22c55e]">TRACK</span>
            </span>
          </div>
        )}
        <ul className="p-4">
        {sidebarItems.map((item) => {
          if (item.hidden || (item.roles !== undefined && !item.roles.includes(role))) {
            return;
          }
          return(<SidebarItem item={item} setShowRecharge={setShowRecharge} toggleSidebar={toggleSidebar} />)
        })}
      </ul>
        </div>
    </div>
    </>
  );
};

export default Sidebar2;

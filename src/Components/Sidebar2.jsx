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
    if (location.pathname=="/dashboard/logout") logout()
    setIsOpen(false);
  },[navigate])

  const sidebarItems = menuItems
  return (
    <>
    {showRecharge ? <WalletRechargeModal onClose={closeRechargeModal} /> : null}
    <div>
      {/* Menu button (Icon) - visible only below md screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 absolute text-gray-700  z-40"
      >
        <FaBars className="h-8 w-6" /> {/* Menu icon */}
      </button>

       {/* Sidebar for md screen */}
       <div className="bg-gray-900 h-full w-64 text-white hidden md:block left-0 overflow-y-auto custom-scrollbar">
      <ul className="p-4 ">
        {sidebarItems.map((item) => {
          if ((item.admin && !admin) || (item.merchantOnly && admin)) {
            return;
          }
          return(<SidebarItem item={item} setShowRecharge={setShowRecharge}/>)
        })}
      </ul>
      </div>
       {/* Sidebar for beloe md screen */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex flex-col`}
        style={{boxShadow: '2px 0 16px 0 rgba(0,0,0,0.15)'}}
      >
        {/* Close button (Icon) - fixed at the top */}
        <div className="sticky top-0 left-0 z-50 bg-gray-800 flex justify-end p-4" style={{borderTopRightRadius: '1rem'}}>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
            aria-label="Close sidebar"
          >
            <FaTimes className="h-7 w-7" />
          </button>
        </div>
        {/* Sidebar content - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2 custom-scrollbar" style={{scrollBehavior: 'smooth'}}>
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              if ((item.admin && !admin) || (item.merchantOnly && admin)) {
                return;
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

// Sidebar.js
import React from 'react';
import { ADMIN_SIDEBAR_ITEMS, MERCHANT_SIDEBAR_ITEMS } from '../Constants';
import { FaTimes } from 'react-icons/fa';  // For close button

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const sidebarItems = user.isAdmin === 1 ? ADMIN_SIDEBAR_ITEMS : MERCHANT_SIDEBAR_ITEMS;

    return (
        <div className="sidebar">

            <div className='hidden md:grid grid-flow-row'>
                {sidebarItems.map((item, index) => (
                    <div className='bg-white border border-t border-gray-300 py-2'>
                    <div key={index}>
                        <a href={item.route}>{item.name}</a>
                    </div></div>
                ))}
            </div>
            {/* Sliding sidebar for mobile screens (below md) */}
      <div
        className={` fixed top-0 left-0 h-full bg-green-50  w-60 z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-4">
          {/* Close button */}
          <button onClick={toggleSidebar}>
            <FaTimes size={24} />
          </button>
        </div>
        <div className='grid grid-flow-row'>
        {sidebarItems.map((item, index) => (
                    <div className='bg-white border border-t border-gray-300 py-2'>
                    <div key={index}>
                        <a href={item.route}>{item.name}</a>
                    </div></div>
                ))}
        </div>
      </div>
        </div>
    );
};

export default Sidebar;

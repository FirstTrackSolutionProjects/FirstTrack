import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import FontAwesome icons
import { menuItems } from '../Constants'; // Import sidebar items
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SidebarItem from './SidebarItem.jsx';
const Sidebar2 = () => {
  const {admin, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    if (location.pathname=="/dashboard/logout") logout()
  },[navigate])

  const sidebarItems = menuItems
  return (
    <div>
      {/* Menu button (Icon) - visible only below md screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 absolute text-gray-700  z-40"
      >
        <FaBars className="h-8 w-6" /> {/* Menu icon */}
      </button>

       {/* Sidebar for md screen */}
       <div className="bg-gray-900 h-full w-64 text-white hidden md:block left-0 overflow-y-scroll">
      <ul className="p-4 ">
        {sidebarItems.map((item) => {
          if ((item.admin && !admin) || (item.merchantOnly && admin)) {
            return;
          }
          return(<SidebarItem item={item} />)
        })}
      </ul>
      </div>
       {/* Sidebar for beloe md screen */}
       <div
        className={`fixed top-0 left-0 h-full w-full bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Close button (Icon) */}
        <button
          onClick={toggleSidebar}
          className="p-4  text-white flex justify-end z-50"
        >
          <FaTimes className="h-7 w-7 " /> {/* Close icon */}
        </button>
        <ul className="p-4 ">
        {sidebarItems.map((item) => {
          if ((item.admin && !admin) || (item.merchantOnly && admin)) {
            return;
          }
          return(<SidebarItem item={item} />)
        })}
      </ul>
        </div>
    </div>
  );
};

export default Sidebar2;

import React, { useEffect, useState } from 'react';
import { FaTachometerAlt, FaWallet, FaHistory, FaUsers,FaFileAlt,FaMoneyBillAlt, FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa'; // Import FontAwesome icons
import { MdReport, MdSettings, MdDashboard } from 'react-icons/md'; // Import Material Design icons
import { ADMIN_SIDEBAR_ITEMS, MERCHANT_SIDEBAR_ITEMS } from '../Constants/index'; // Import sidebar items
import { useNavigate } from 'react-router-dom';
import { FaDollyFlatbed,FaBox,FaUser,FaClipboardList } from "react-icons/fa";


const Sidebar2 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null); // To track which dropdown is open
  const navigate = useNavigate();
  const [currentRoute, setCurrentRoute] = useState('/dashboard');
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Toggle dropdown based on menuId
  const handleDropdownToggle = (menuId) => {
    if (activeDropdown === menuId) {
      setActiveDropdown(null); // Close the dropdown if clicked again
    } else {
      setActiveDropdown(menuId); // Open the clicked dropdown
    }
  };

  useEffect(()=>{
    navigate(currentRoute);
  },[currentRoute])

  const user = JSON.parse(localStorage.getItem('user'));
    const sidebarItems = user.isAdmin === 1 ? ADMIN_SIDEBAR_ITEMS : MERCHANT_SIDEBAR_ITEMS;

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
       <div className="bg-gray-800 h-full w-64 text-white hidden md:block left-0">
      <ul className="p-4 ">
        {sidebarItems.map((item) => (
          <li key={item.menuId} className="mb-2">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-700">
              <button
                onClick={item.isDropdown ? ()=>handleDropdownToggle(item.menuId):() => {
                  setCurrentRoute(item.route);
                  setIsOpen(false); // Call the menu click handler
                }}
                className="flex items-center w-full"
              >
                {/* Dynamically render icons based on item name */}
                {item.name === 'Dashboard' && <FaTachometerAlt className="mr-3" />}
                {item.name === 'Wallet Recharge' && <FaWallet className="mr-3" />}
                {item.name === 'Transaction History' && <FaHistory className="mr-3" />}
                {item.name === 'Merchant Manage' && <FaUsers className="mr-3" />}
                {item.name === 'Submission' && <FaFileAlt className="mr-3" />}
                {item.name === 'Manual Recharge' && <FaMoneyBillAlt className="mr-3" />}
                {item.name === 'Reports' && <FaClipboardList className="mr-3" />}
                {item.name === 'Settings' && <MdSettings className="mr-3" />}
                {item.name === 'My Shipments' && <FaDollyFlatbed className="mr-3" />}
                {item.name === 'Add Shipment' && <FaBox className="mr-3" />}
                {item.name === 'My Profile' && <FaUser className="mr-3" />}
                <span>{item.name}</span>
              </button>

              {/* Dropdown toggle button */}
              {item.isDropdown && (
                <button
                  className="focus:outline-none"
                  onClick={() => handleDropdownToggle(item.menuId)}
                >
                  {activeDropdown === item.menuId ? (
                    <FaChevronUp className="text-white" />
                  ) : (
                    <FaChevronDown className="text-white" />
                  )}
                </button>
              )}
            </div>

            {/* Show dropdown only if activeDropdown matches current menuId */}
            {item.isDropdown && activeDropdown === item.menuId && (
              <ul className="ml-8 mt-2 space-y-1">
                {item.dropdownOptions.map((dropdownItem) => (
                  <li key={dropdownItem.menuId} className="flex items-center p-2 rounded-lg hover:bg-gray-700">
                    <button
                      onClick={() => onMenuClick(dropdownItem.route)}
                      className="flex items-center w-full"
                    >
                      {dropdownItem.name === 'Domestic' && <FaShippingFast className="mr-3" />}
                      {dropdownItem.name === 'International' && <FaShippingFast className="mr-3" />}
                      <span>{dropdownItem.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
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
        <ul className="p-4">
        {sidebarItems.map((item) => (
          <li key={item.menuId} className="mb-2">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-700">
              <button
                onClick={item.isDropdown ? ()=>handleDropdownToggle(item.menuId):() => {
                  setCurrentRoute(item.route); // Call the menu click handler
                  setIsOpen(false);
                }}
                className="flex items-center w-full"
              >
                {/* Dynamically render icons based on item name */}
                {item.name === 'Dashboard' && <FaTachometerAlt className="mr-3" />}
                {item.name === 'Wallet Recharge' && <FaWallet className="mr-3" />}
                {item.name === 'Transaction History' && <FaHistory className="mr-3" />}
                {item.name === 'Merchant Manage' && <FaUsers className="mr-3" />}
                {item.name === 'Submission' && <FaFileAlt className="mr-3" />}
                {item.name === 'Manual Recharge' && <FaMoneyBillAlt className="mr-3" />}
                {item.name === 'Reports' && <MdReport className="mr-3" />}
                {item.name === 'Settings' && <MdSettings className="mr-3" />}
                <span>{item.name}</span>
              </button>

              {/* Dropdown toggle button */}
              {item.isDropdown && (
                <button
                  className="focus:outline-none"
                  onClick={() => handleDropdownToggle(item.menuId)}
                >
                  {activeDropdown === item.menuId ? (
                    <FaChevronUp className="text-white" />
                  ) : (
                    <FaChevronDown className="text-white" />
                  )}
                </button>
              )}
            </div>

            {/* Show dropdown only if activeDropdown matches current menuId */}
            {item.isDropdown && activeDropdown === item.menuId && (
              <ul className="ml-8 mt-2 space-y-1">
                {item.dropdownOptions.map((dropdownItem) => (
                  <li key={dropdownItem.menuId} className="flex items-center p-2 rounded-lg hover:bg-gray-700">
                    <button
                      onClick={() => onMenuClick(dropdownItem.route)}
                      className="flex items-center w-full"
                    >
                      {dropdownItem.name === 'Domestic' && <FaShippingFast className="mr-3" />}
                      {dropdownItem.name === 'International' && <FaShippingFast className="mr-3" />}
                      <span>{dropdownItem.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
        </div>
    </div>
  );
};

export default Sidebar2;

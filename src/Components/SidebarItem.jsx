
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
const SidebarItem = ({ item, setShowRecharge }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const {admin} = useAuth()
    const [isOpen, setIsOpen] = useState(false) // Changed initial state to false for consistency
    const isCurrentMenu = location.pathname === `/dashboard/${item.url}` || (item.isDropdown && item.dropDownOptions.some(subitem => location.pathname.startsWith(`/dashboard/${subitem.url}`))); // Check if any subitem is active or the item itself

    useEffect(() => {
        // If the current path is within this item's dropdown, open it
        if (item.isDropdown && item.dropDownOptions.some(subitem => location.pathname.startsWith(`/dashboard/${subitem.url}`))) {
            setIsOpen(true);
        } else {
            setIsOpen(false); // Close dropdown if not relevant
        }
    }, [location.pathname, item]); // Added item to dependencies

    const handleClick = () => {
        if (item.isDropdown) {
            setIsOpen(!isOpen);
        } else if (item.name === "Wallet Recharge") {
            setShowRecharge(true);
        } else if (item.url === 'logout') { // Handle logout separately for consistency with other custom logic
            navigate(`/dashboard/${item.url}`);
        } else {
            navigate(`/dashboard/${item.url}`); // Prefix with /dashboard
        }
    };

    return (
        <>
            <div
                onClick={handleClick}
                className={`cursor-pointer px-4 py-3 w-full rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center
                ${isCurrentMenu ? 'bg-[#22c55e] text-white shadow-md' : 'text-gray-200 hover:bg-gray-700 hover:text-white'}`}
            >
                {item.icon && (typeof item.icon === 'string' ? ( // If it's a string, treat as image path
                    <img src={item.icon} alt={item.name || 'icon'} className='mr-3 w-5 h-5 object-contain' />
                ) : ( // Otherwise, assume it's a React component
                    <item.icon className='mr-3 text-lg' />
                ))}
                <span className='flex-grow'>{item.name}</span>
                {item.isDropdown ? (
                    <span className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}> {/* Chevron rotates */}
                        <FaChevronDown className="h-3 w-3" />
                    </span>
                ) : null}
            </div>
            {item.isDropdown && (
                <div className={`mt-1 ml-4 border-l-2 border-gray-700 pl-4 ${isOpen ? 'block' : 'hidden'}`}> {/* Indented dropdown */}
                    {item.dropDownOptions.map((subitem) => {
                        if ((subitem.admin && !admin) || (subitem.merchantOnly && admin)) return null;
                        return <SidebarItem key={subitem.label || subitem.name} item={subitem} setShowRecharge={setShowRecharge} />
                    })}
                </div>
            )}
        </>
    )
}

export default SidebarItem
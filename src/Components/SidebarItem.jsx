
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { USER_ROLES } from '@/Constants'
const SidebarItem = ({ item, setShowRecharge, toggleSidebar = () => {}, sidebarExpanded = true }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const {role} = useAuth()
    const admin = role === USER_ROLES.ADMIN;
    const [isOpen, setIsOpen] = useState(false)
    const [isCurrentMenu, setIsCurrentMenu] = useState(false);
    
    useEffect(() => {
        const fullPath = `/dashboard/${item.url}`.replace(/\/+$/, '');
        const currentPath = location.pathname.replace(/\/+$/, '');
        
        // Match exact or parent of current path
        const isActive = currentPath === fullPath || 
                        (item.url !== "" && currentPath.startsWith(fullPath + "/"));
        
        // Also check if any child is active to highlight parent
        const isChildActive = item.isDropdown && item.dropDownOptions?.some(sub => {
             const subPath = `/dashboard/${sub.url}`.replace(/\/+$/, '');
             return currentPath === subPath || currentPath.startsWith(subPath + "/");
        });

        setIsCurrentMenu(isActive || isChildActive);
    }, [location.pathname, item.url, item.isDropdown, item.dropDownOptions]);

    // Close dropdown whenever sidebar collapses (icon-only mode)
    useEffect(() => {
        if (!sidebarExpanded && isOpen) {
            setIsOpen(false)
        }
    }, [sidebarExpanded, isOpen])

    return (
        <>
            <div
                onClick={item.isDropdown ? () => setIsOpen(!isOpen) : (item.name === "Wallet Recharge" ? () => setShowRecharge(true) : () => { navigate(`/dashboard/${item.url}`); toggleSidebar(); })}
                title={!sidebarExpanded ? item.name : ""}
                className={`cursor-pointer px-4 w-full h-12 ${isCurrentMenu ? 'bg-[#22c55e]' : 'bg-transparent'} text-white focus:outline-none transition-all duration-200 hover:bg-white/10 relative flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} group`}
            >
                {isCurrentMenu && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#fff]" />}
                <div className={`flex items-center justify-center flex-shrink-0 ${sidebarExpanded ? 'w-6 mr-3' : 'w-10'}`}>
                    {item.icon && typeof item.icon !== 'string' && <item.icon size={24} className={`flex-shrink-0 transition-colors duration-200 ${isCurrentMenu ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />}
                </div>
                
                {sidebarExpanded && <span className={`text-sm font-medium whitespace-nowrap transition-all duration-200 ${isCurrentMenu ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item.name}</span>}
                
                {sidebarExpanded && item.isDropdown && (
                    <FaChevronUp 
                        size={12} 
                        className={`absolute right-4 transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} 
                    />
                )}
            </div>
            {item.isDropdown && isOpen && sidebarExpanded && (
                <div className="bg-black/20 py-1">
                    {item.dropDownOptions.map((subitem, index) => {
                        if ((subitem.admin && !admin) || (subitem.merchantOnly && admin)) return null;
                        return (
                            <div key={index} className="pl-4">
                                <SidebarItem 
                                    item={subitem} 
                                    setShowRecharge={setShowRecharge} 
                                    toggleSidebar={toggleSidebar} 
                                    sidebarExpanded={sidebarExpanded} 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    )
}

export default SidebarItem
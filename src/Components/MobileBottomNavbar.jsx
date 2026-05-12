import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaHome, FaBox, FaClipboardList, FaHistory, FaPlusSquare, 
    FaTags, FaUsers, FaUserCircle, FaInfoCircle, FaHeadset, FaCog, FaChevronUp,
    FaMoneyBillAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../Constants';

const MobileBottomNavbar = ({ isDashboardRoute }) => {
    const location = useLocation();
    const { isAuthenticated, role } = useAuth();
    const [merchantMenuOpen, setMerchantMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu on route change or click outside
    useEffect(() => {
        setMerchantMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMerchantMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const publicNavItems = [
        { icon: FaHome, name: 'Home', path: '/' },
        { icon: FaInfoCircle, name: 'About', path: '/about' },
        { icon: FaClipboardList, name: 'Track', path: '/track' },
        { icon: FaTags, name: 'Pricing', path: '/pricing' },
        { icon: FaUserCircle, name: 'Dash', path: isAuthenticated ? '/dashboard' : '/login' },
    ];

    const merchantDashboardItems = [
        { icon: FaUserCircle, name: 'Dash', path: '/dashboard' },
        { icon: FaBox, name: 'Parcels', path: '/dashboard/shipments/domestic' },
        { icon: FaPlusSquare, name: 'Create', path: '/dashboard/order/domestic/create' },
        { icon: FaClipboardList, name: 'Reports', path: '/dashboard/shipment/domestic/reports' },
        { icon: FaHistory, name: 'History', path: '/dashboard/transaction-history' },
    ];

    const adminDashboardItems = [
        { icon: FaUserCircle, name: 'Dash', path: '/dashboard' },
        { icon: FaUsers, name: 'Merchant', isMenu: true },
        { icon: FaBox, name: 'Warehouse', path: '/dashboard/warehouse' },
        { icon: FaHeadset, name: 'Support', path: '/dashboard/admin/support' },
        { icon: FaMoneyBillAlt, name: 'COD', path: '/dashboard/cod-remittance-manage' },
    ];

    const adminMerchantSubItems = [
        { name: 'Verified', path: '/dashboard/manage/merchant/verified' },
        { name: 'Non-Verified', path: '/dashboard/manage/merchant/non-verified' },
        { name: 'Transactions', path: '/dashboard/manage/merchant/transactions' },
        { name: 'Shipments', path: '/dashboard/manage/merchant/shipments/domestic' },
        { name: 'Reports', path: '/dashboard/manage/merchant/shipments/domestic/reports' },
    ];

    const currentNavItems = isDashboardRoute
        ? (role === USER_ROLES.ADMIN ? adminDashboardItems : merchantDashboardItems)
        : publicNavItems;

    const isActiveLink = (path) => {
        if (!path) return false;
        if (path === '/dashboard') {
            return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.08)] border-t border-gray-100 flex justify-around items-center px-1 py-2 md:hidden z-50 transition-all duration-300">
            {currentNavItems.map((item) => {
                if (item.isMenu) {
                    const isAnySubActive = adminMerchantSubItems.some(sub => isActiveLink(sub.path));
                    return (
                        <div key={item.name} className="relative flex-1" ref={menuRef}>
                            {merchantMenuOpen && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white shadow-2xl rounded-2xl border border-gray-100 py-2 w-48 animate-in fade-in slide-in-from-bottom-4 duration-200">
                                    <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100"></div>
                                    {adminMerchantSubItems.map((sub) => (
                                        <Link
                                            key={sub.name}
                                            to={sub.path}
                                            className={`block px-4 py-3 text-sm transition-colors ${
                                                isActiveLink(sub.path) 
                                                ? 'text-blue-600 bg-blue-50 font-semibold' 
                                                : 'text-gray-700 active:bg-gray-50'
                                            }`}
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => setMerchantMenuOpen(!merchantMenuOpen)}
                                className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all duration-200
                                    ${(merchantMenuOpen || isAnySubActive) ? 'text-blue-600' : 'text-gray-500'}`}
                            >
                                <div className="relative">
                                    <item.icon className="text-xl mb-0.5" />
                                    <FaChevronUp className={`absolute -right-3 top-0 text-[10px] transition-transform duration-200 ${merchantMenuOpen ? 'rotate-180' : ''}`} />
                                </div>
                                <span className="text-[10px] font-medium tracking-tight">{item.name}</span>
                            </button>
                        </div>
                    );
                }

                const active = isActiveLink(item.path);
                return (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 flex-1
                            ${active ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <item.icon className={`text-xl mb-0.5 ${active ? 'scale-110' : ''} transition-transform`} />
                        <span className={`text-[10px] tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default MobileBottomNavbar;
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // Menu icon
import { IoMdClose } from 'react-icons/io'; // Close icon
import { Link, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDoorOpen } from 'react-icons/fa';
import WalletRechargeModal from './WalletRechargeModal' 
import { FaWallet } from 'react-icons/fa'; // Added FaWallet icon

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

  const [availableRoles, setAvailableRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [switchingRoleId, setSwitchingRoleId] = useState(null)
  const roleDropdownDesktopRef = useRef(null)
  const roleDropdownMobileRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setAvailableRoles([])
      setRoleMenuOpen(false)
      return;
    }

    let active = true
    const fetchRoles = async () => {
      try {
        setRolesLoading(true)
        const roles = await getAvailableRoles()
        if (!active) return
        setAvailableRoles(Array.isArray(roles) ? roles : [])
      } catch (e) {
        if (!active) return
        setAvailableRoles([])
      } finally {
        if (active) setRolesLoading(false)
      }
    }

    fetchRoles()
    return () => {
      active = false
    }
  }, [isAuthenticated])

  const shouldShowRoleSwitcher = useMemo(() => {
    return isAuthenticated && Array.isArray(availableRoles) && availableRoles.length > 1
  }, [isAuthenticated, availableRoles])

  useEffect(() => {
    if (!roleMenuOpen) return
    const onMouseDown = (e) => {
      const desktopEl = roleDropdownDesktopRef.current
      const mobileEl = roleDropdownMobileRef.current
      const clickedInsideDesktop = desktopEl?.contains?.(e.target)
      const clickedInsideMobile = mobileEl?.contains?.(e.target)
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setRoleMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [roleMenuOpen])

  const handleSwitchRole = async (nextRole) => {
    try {
      const nextUserRoleId = nextRole?.user_role_id
      if (!nextUserRoleId) throw new Error('Invalid role')
      if (switchingRoleId) return

      if (String(nextRole?.role || '').toUpperCase() === String(role || '').toUpperCase()) {
        setRoleMenuOpen(false)
        return
      }

      setSwitchingRoleId(nextUserRoleId)
      const newToken = await changeRoleService(nextUserRoleId)
      localStorage.setItem('token', newToken)
      setRoleMenuOpen(false)
      setMenuOpen(false)
      window.location.reload()
    } catch (e) {
      toast.error(e?.message || 'Failed to change role')
    } finally {
      setSwitchingRoleId(null)
    }
  }

  const RoleDropdownMenu = ({ containerRef }) => {
    if (!shouldShowRoleSwitcher) return null
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          className="bg-white text-black flex items-center font-medium rounded-xl px-2 py-2 cursor-pointer max-w-xs truncate"
          onClick={() => setRoleMenuOpen((o) => !o)}
          disabled={rolesLoading}
          title={role ? `Current role: ${role}` : 'Switch role'}
        >
          <span className="truncate">{role ? `Role: ${role}` : 'Switch Role'}</span>
          <span className="ml-2">▾</span>
        </button>

        {roleMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
            {availableRoles.map((r) => {
              const isActive = String(r?.role || '').toUpperCase() === String(role || '').toUpperCase()
              const isBusy = switchingRoleId === r?.user_role_id
              return (
                <button
                  key={r?.user_role_id}
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 ${isActive ? 'bg-red-50 font-medium' : ''} ${(switchingRoleId && !isBusy) ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={() => handleSwitchRole(r)}
                  disabled={Boolean(switchingRoleId) || isActive}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{r?.role}</span>
                    {isBusy ? <span className="text-xs text-gray-500">Switching…</span> : null}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

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

  // Helper function to format balance
  const formatBalance = (value) => {
    return parseFloat(value).toFixed(2);
  };

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
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/images/logo.svg"
              alt="First Track Logistics Logo"
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold ml-2 text-gray-800 whitespace-nowrap">
              FIRST <span className="text-[#22c55e]">TRACK</span>
            </span>
          </Link>

          {/* Desktop nav */}
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

          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 min-w-0">
            {(isAuthenticated &&
              verified &&
              location.pathname.startsWith("/dashboard")) && (
              <div className="md:hidden flex-shrink-0">
                <div
                  onClick={() => setShowRecharge(true)}
                  className={`relative bg-indigo-600 text-white flex items-center font-medium rounded-full px-3 py-1 text-sm cursor-pointer transition-all duration-200 shadow-sm whitespace-nowrap ${
                    balance < 250
                      ? "ring-2 ring-red-500 ring-offset-1 bg-red-500"
                      : "hover:scale-105"
                  }`}
                  aria-label={`Current balance: ₹${formatBalance(
                    balance
                  )}. Click to recharge.`}
                >
                  <FaWallet className="mr-1 text-base" />
                  <p>{`₹${formatBalance(balance)}`}</p>
                
                  {balance < 250 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold animate-pulse">
                      !
                    </span>
                  )}
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="md:flex items-center space-x-4 hidden flex-shrink-0 min-w-0">
                {(verified &&
                  location.pathname.startsWith("/dashboard")) && (
                  <div
                    onClick={() => setShowRecharge(true)}
                    className={`relative bg-indigo-600 text-white flex items-center font-medium rounded-full px-4 py-2 cursor-pointer transition-all duration-200 shadow-sm whitespace-nowrap ${
                      balance < 250
                        ? "ring-2 ring-red-500 ring-offset-1 bg-red-500"
                        : "hover:scale-105"
                    }`}
                    aria-label={`Current balance: ₹${formatBalance(
                      balance
                    )}. Click to recharge.`}
                  >
                    <FaWallet className="mr-2 text-lg" />
                    <p>{`₹${formatBalance(balance)}`}</p>
                  
                    {balance < 250 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold animate-pulse">
                        !
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2 min-w-0">
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
            )}

            {/* Mobile menu button */}
            <div className="md:hidden z-50 flex-shrink-0">
              <button onClick={toggleSidebar} aria-label="Open menu">
                <AiOutlineMenu className="text-[#22c55e]" size={28} />
              </button>
            </div>
          </div>
        </div>
          
        {/* Mobile sidebar */}
        <div
          className={`z-40 fixed top-0 right-0 w-64 bg-white h-full shadow-lg transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <span className="text-lg font-bold"></span>
        
            <button onClick={toggleSidebar}>
              <IoMdClose size={30} />
            </button>
          </div>
        
          <div className="flex items-center space-x-4 p-2">
            <RoleDropdownMenu containerRef={roleDropdownDesktopRef} />
        
            {isAuthenticated && (
              <div className="flex items-center justify-between w-full bg-gray-200 rounded-xl">
                <span className="mx-2 font-bold text-lg truncate">{name}</span>
            
                <button
                  className="bg-red-500 text-white text-xl p-3 rounded-xl"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <FaDoorOpen />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

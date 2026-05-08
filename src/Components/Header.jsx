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
  const {isAuthenticated, name, logout, verified, role} = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSidebarOpen]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'TRACKING', path: '/track' },
    { name: 'BLOGS', path: '/blog' },
    { name: 'PRICING', path: '/pricing' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];
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
          <Link to="/" className="flex items-center flex-shrink-0 mr-1 sm:mr-4">
            <img
              src="/images/logo.svg"
              alt="First Track Logistics Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
            <span className="text-sm sm:text-xl md:text-2xl font-extrabold ml-1.5 sm:ml-2 text-gray-800 whitespace-nowrap">
              FIRST <span className="text-[#22c55e] min-[380px]:inline">TRACK</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex flex-grow justify-center min-w-0">
            <div className="flex flex-wrap justify-center md:space-x-4 lg:space-x-8 text-base">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={getNavLinkClass}>
                  {link.name}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0 min-w-0 ml-auto">
            {(isAuthenticated &&
              verified &&
              location.pathname.startsWith("/dashboard")) && (
              <div className="flex-shrink-0">
                <div
                  onClick={() => setShowRecharge(true)}
                  className={`relative bg-indigo-600 text-white flex items-center font-semibold rounded-full 
                    px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-2 text-[10px] sm:text-xs md:text-sm cursor-pointer transition-all duration-200 shadow-sm whitespace-nowrap ${
                    balance < 250
                      ? "ring-2 ring-red-500 ring-offset-1 bg-red-500"
                      : "hover:scale-105"
                  }`}
                  aria-label={`Current balance: ₹${formatBalance(
                    balance
                  )}. Click to recharge.`}
                >
                  <FaWallet className="mr-1 md:mr-2 text-xs sm:text-sm md:text-lg" />
                  <p className="flex items-center">
                    <span className="hidden min-[420px]:inline mr-0.5">₹</span>
                    {formatBalance(balance)}
                  </p>
                
                  {balance < 250 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center text-[8px] sm:text-[10px] md:text-sm font-bold animate-pulse">
                      !
                    </span>
                  )}
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="md:flex items-center space-x-4 hidden flex-shrink-0 min-w-0">
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
          
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={`z-50 fixed top-0 right-0 w-72 bg-white h-full shadow-2xl transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden flex flex-col`}
        >
          <div className="p-4 flex justify-between items-center border-b shrink-0">
            <span className="text-lg font-bold text-green-700">MENU</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <IoMdClose size={28} />
            </button>
          </div>
        
          <div className="flex-grow overflow-y-auto">
            {/* User Section */}
            <div className="p-4 border-b bg-gray-50">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Welcome,</p>
                      <p className="font-bold text-lg truncate text-gray-800">{name}</p>
                    </div>
                    <button
                      className="bg-red-500 text-white p-2.5 rounded-lg shadow-sm active:scale-95 transition-all"
                      onClick={() => { logout(); setIsSidebarOpen(false); }}
                      aria-label="Logout"
                    >
                      <FaDoorOpen size={20} />
                    </button>
                  </div>
                  <RoleDropdownMenu containerRef={roleDropdownMobileRef} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-center py-2 border border-green-600 text-green-600 rounded-lg font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-center py-2 bg-green-600 text-white rounded-lg font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Section */}
            <nav className="p-2 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={getMobileNavLinkClass}
                >
                  {link.name}
                </NavLink>
              ))}
              {isAuthenticated && verified && (
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsSidebarOpen(false)}
                  className={getMobileNavLinkClass}
                >
                  DASHBOARD
                </NavLink>
              )}
            </nav>
          </div>

          {/* Footer of Sidebar */}
          <div className="p-4 border-t text-center text-xs text-gray-400">
            © {new Date().getFullYear()} First Track Logistics
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

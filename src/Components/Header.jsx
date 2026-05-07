import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // Menu icon
import { IoMdClose } from 'react-icons/io'; // Close icon
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDoorOpen } from 'react-icons/fa';
import WalletRechargeModal from './WalletRechargeModal' 

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
      console.log("Fetching balance")
      const balance = await fetch(
        `${API_URL}/wallet/balance`,{
          method : 'POST',
          headers:{
            "Authorization":localStorage.getItem("token"),
          }
        }
      )
        .then((response) => response.json())
        .then((result) => {console.log(result); return result.balance});
      if (balance) {
        setBalance(balance);
      }
    };
    if (isAuthenticated && verified){
        fetchBalance();
    }
  }, [isAuthenticated]);

  return (
    <>
    {showRecharge ? <WalletRechargeModal onClose={closeRechargeModal} /> : null}
    <header className="bg-gray-100 shadow-md w-full font-inter">
      {/* Container for logo and navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex  justify-between md:justify-around  items-center py-1">
        {/* Logo and Company Name */}
        <Link to='/'><div className="flex items-center">
          <img src="/images/logo.svg" alt="Logo" className="w-20 h-20 " />
          
        </div></Link>

        {/* Menu for md and above */}
        <nav className="-ml-20 hidden md:flex space-x-6 text-base font-semibold">
          <Link to="/" className="hover:text-blue-800">HOME</Link>
          <Link to="/track" className="hover:text-blue-800">TRACKING</Link>
          <Link to="/blog" className="hover:text-blue-800">BLOGS</Link>
          <Link to="/pricing" className="hover:text-blue-800">PRICING</Link>
          <Link to="/about" className="hover:text-blue-800">ABOUT</Link>
          <Link to="/contact" className="hover:text-blue-800">CONTACT</Link>
        </nav>
        <div className='md:hidden' onClick={()=>setShowRecharge(true)}>
          {verified && location.pathname.startsWith('/dashboard')? (<>
              <div onClick={()=>setShowRecharge(true)} className={`relative bg-green-600 ${balance < 250 ? "text-red-400" : "text-white"} flex items-center font-medium rounded-tl-xl rounded-br-xl px-3 min-w-14 py-2 cursor-pointer border-l-4 border-t-4 border-green-900`}>
              {balance < 250 && <p className="absolute -mt-5 top-0 right-[2px] text-red-400 text-3xl">!</p>}
                <p>{`₹${balance}`}</p>
              </div>
              </>
          ):null}
        </div>
        {isAuthenticated?<div className='md:flex items-center space-x-4 hidden'>
          {verified && location.pathname.startsWith('/dashboard')? (<>
              <div onClick={()=>setShowRecharge(true)} className={`relative bg-green-600 ${balance < 250 ? "text-red-400" : "text-white"} flex items-center font-medium rounded-tl-xl rounded-br-xl px-3 min-w-14 py-2 cursor-pointer border-l-4 border-t-4 border-green-900`}>
              {balance < 250 && <p className="absolute -mt-5 top-0 right-[2px] text-red-400 text-3xl">!</p>}
                <p>{`₹${balance}`}</p>
              </div>
              </>
          ):null}
          <div className='flex items-center'>
            {name} <span className='bg-red-500 text-white text-xl p-3 cursor-pointer rounded-xl mx-3' onClick={logout}><FaDoorOpen /></span>
          </div>
          </div>:null}
        {/* Menu button for small screens */}
        <div className="md:hidden z-30">
          <button onClick={toggleSidebar}>
            <AiOutlineMenu className='text-green-700' size={30} />
          </button>
        </div>
      </div>

      {/* Sidebar for small screens */}
      <div
        className={` z-40 fixed top-0 right-0 w-64 bg-white h-full shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <span className="text-lg font-bold"></span>
          <button onClick={toggleSidebar}>
            <IoMdClose size={30} />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <RoleDropdownMenu containerRef={roleDropdownDesktopRef} />
          {isAuthenticated?<div className="flex items-center justify-between w-full bg-gray-200 mx-2 rounded-xl">
  <span className='mx-2 font-bold text-lg'>{name}</span>
  <span
    className="bg-red-500 text-white text-xl p-3 cursor-pointer rounded-xl"
    onClick={logout}
  >
    <FaDoorOpen />
  </span>
</div>:null}
        </div>
        <nav className="flex flex-col p-4 space-y-4 text-lg">
          <Link to="/" className="hover:text-blue-500" onClick={toggleSidebar}>Home</Link>
          <Link to="/track" className="hover:text-blue-500" onClick={toggleSidebar}>Tracking</Link>
          <Link to="/about" className="hover:text-blue-500" onClick={toggleSidebar}>About</Link>
          <Link to="/blog" className="hover:text-blue-500" onClick={toggleSidebar}>Blogs</Link>
          <Link to="/pricing" className="hover:text-blue-500" onClick={toggleSidebar}>Pricing</Link>
          <Link to="/contact" className="hover:text-blue-500" onClick={toggleSidebar}>Contact</Link>
        </nav>
      </div>
    </header>
    </>
  );
};

export default Header;

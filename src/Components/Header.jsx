import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // Menu icon
import { IoMdClose } from 'react-icons/io'; // Close icon
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDoorOpen } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_APP_API_URL

const Header = () => {
  const {isAuthenticated, name, logout, verified} = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        
        {isAuthenticated?<div className='flex items-center space-x-4'>
          {verified? (<>
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
  );
};

export default Header;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const page = userData.isAdmin === 1 ? <div>Admin</div> : <div>Merchant</div>

  useEffect(() => {
    
    if (!userData) {
      navigate('/login');  // Redirect to login if no user is found
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Navigate to the homepage
    navigate('/');
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  

  if (!user) {
    return <div><h1>ERROR</h1></div>; // Loading or redirecting
  }

  return (
    <div className='dashboard flex'>
      {/* Menu button for mobile screens */}
      <button onClick={toggleSidebar} className="absolute md:hidden p-4">
        <FaBars size={24} />
      </button>
    <div className='flex h-screen w-full bg-gray-200'>
      <div className='md:w-1/5 h-screen bg-green-100 justify-center'>
      
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className='z-10 md:w-4/5  justify-center mx-auto  '>
      <div className='text-center '>
      <div className='flex gap-1 mt-5 justify-center'>Welcome to <span className='font-semibold'>{page}</span> Dashboard! </div> 
      <p>Your name: <span className='font-bold text-green-600'> {user.fullName} </span></p>
      </div>
      <div className="flex justify-center">
      <button onClick={handleLogout} className=' mt-5 py-2  px-4 text-center bg-green-700 text-white  rounded-full'>
        Logout
      </button>
      </div>
      </div>
      
      
      </div>
    </div>
  );
};

export default Dashboard;

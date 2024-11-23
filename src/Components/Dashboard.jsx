import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar2 from './Sidebar2';
import { Router,Routes,Route } from 'react-router-dom';
import DashHome from './DashHome';
import WalletRecharge from './WalletRecharge';
import Transaction from './Transaction';
import MerchantManage from './MerchantManage';
import ManualRecharge from './ManualRecharge';
import Settings from './Settings';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const {admin} = useAuth()
  //const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  admin === 1 ? <div>Admin</div> : <div>Merchant</div>

  
 
  

return (
    <>
    <div className='h-screen flex font-inter bg-gray-200'>
      {/* Menu button for mobile screens
      <button onClick={toggleSidebar} className="absolute md:hidden p-4">
        <FaBars size={24} />
      </button>  */}
    
      <Sidebar2 /> {/* Pass the click handler */}
        <main className="flex-grow justify-center items-center">
          <Routes>
            <Route path="/" element={<DashHome/>} />
            <Route path="/wallet-recharge" element={<WalletRecharge />} />
            <Route path="/transaction" element={<Transaction/>} />
            <Route path="/merchant-manage" element={<MerchantManage />} />
            <Route path="/manual-recharge" element={<ManualRecharge />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add other routes as needed */}
          </Routes>
        </main>

    </div>
    </>
  );
};

export default Dashboard;

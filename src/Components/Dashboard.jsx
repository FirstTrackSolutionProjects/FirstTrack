import React, { createElement } from 'react';
import Sidebar2 from './Sidebar2';
import { Routes,Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuItems } from '../Constants';
import { useNavigate } from 'react-router-dom';
// FIX: Corrected paths to the Pages folder
import AdminTicketDetail from '../Pages/AdminTicketDetail';
import TicketDetail from '../Pages/TicketDetail';

const Dashboard = () => {
  const { role, isAuthenticated, verified } = useAuth();
  const navigate = useNavigate();

  // Handle Admin check (Adjust based on your actual AuthContext variable name)
  const isAdmin = role === 'ADMIN'; 

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  // Only check verification for Merchants, not Admins
  if (!verified && !isAdmin) {
    navigate('/verify');
    return null;
  }

  const generateRoutes = (items, adminMode) => {
    return items.flatMap((item, index) => {
      // Logic to filter routes based on role
      if ((item.admin && !adminMode) || (item.merchantOnly && adminMode)) {
        return [];
      }
      const routes = [
        <Route
          key={item.url || `route-${index}`}
          path={item.url}
          element={item.component ? createElement(item.component) : null}
        />
      ];
      if (item.dropDownOptions && item.dropDownOptions.length > 0) {
        routes.push(...generateRoutes(item.dropDownOptions, adminMode));
      }
      return routes;
    });
  };

  return (
    <div className='h-[calc(100vh-86px)] flex font-inter bg-gray-200'>
      <Sidebar2 />
      <main className="flex-grow justify-center items-center overflow-y-auto">
        <Routes>
          {/* Dynamically generated routes from constants */}
          {generateRoutes(menuItems, isAdmin)}

          {/* Manually defined Detail routes */}
          <Route path="admin/support/:id" element={<AdminTicketDetail />} />
          <Route path="support/:id" element={<TicketDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;

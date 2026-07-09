import React, { createElement } from 'react';
import Sidebar2 from './Sidebar2';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuItems, USER_ROLES } from '../Constants';
import { useNavigate } from 'react-router-dom';
import AdminTicketDetail from '../Pages/AdminTicketDetail';
import TicketDetail from '../Pages/TicketDetail';

const Dashboard = () => {
  const { role, isAuthenticated, verified, authLoading, features } = useAuth()
  const navigate = useNavigate();
  const isKycExempt = role === USER_ROLES.ADMIN;
  const needsKycVerification = !verified && !isKycExempt;
  React.useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 1. If the user needs verification (i.e., they are a Merchant and verified=0)
    if (needsKycVerification) {
      navigate('/verify');
      return;
    }

    // 2. If they are authenticated and either verified=1 OR they are KYC Exempt,
    // they fall through and the dashboard renders.

  }, [isAuthenticated, verified, navigate, role, needsKycVerification, authLoading]);

  if (!isAuthenticated || needsKycVerification) {
    return null;
  }
  const generateRoutes = (items, role) => {
    return items.flatMap((item, index) => {
      if (item.hidden || (item.roles !== undefined && !item.roles.includes(role)) || (item.featureSwitchId && !features[item.featureSwitchId])) {
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
        routes.push(...generateRoutes(item.dropDownOptions, role));
      }
      return routes;
    });
  };

  return (
    <div className='h-[calc(100vh-86px)] flex font-inter bg-[#f8fafc] text-gray-800'> {/* Adjusted background to a lighter, softer shade */}
      <Sidebar2 />
      <main className="flex-grow justify-center items-center overflow-y-auto">
        <Routes>
          {generateRoutes(menuItems, role)}
          <Route path="admin/support/:id" element={<AdminTicketDetail />} />
          {/* FIX: Add the standard merchant ticket detail route */}
          <Route path="support/:id" element={<TicketDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;

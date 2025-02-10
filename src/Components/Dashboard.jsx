import React, { createElement } from 'react';
import Sidebar2 from './Sidebar2';
import { Routes,Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuItems } from '../Constants';

const Dashboard = () => {
  const {admin} = useAuth()
  const generateRoutes = (items, admin) => {
    return items.flatMap((item, index) => {
      if ((item.admin && !admin) || (item.merchantOnly && admin)) {
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
        routes.push(...generateRoutes(item.dropDownOptions, admin));
      }
      return routes;
    });
  };
return (
    <>
    <div className='h-[calc(100vh-86px)] flex font-inter bg-gray-200'>
      <Sidebar2 />
        <main className="flex-grow justify-center items-center overflow-y-auto">
          <Routes>
            {generateRoutes(menuItems, admin)}
          </Routes>
        </main>

    </div>
    </>
  );
};

export default Dashboard;

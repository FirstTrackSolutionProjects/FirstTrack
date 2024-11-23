import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({
    username: localStorage.getItem('username'),
    token: localStorage.getItem('token'),
  });

  const login = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    setAuth({ username, token });
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setAuth({ username: null, token: null });
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch (error) {
      return false;
    }
  };

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     logout();
  //   }
  // }, []);
  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

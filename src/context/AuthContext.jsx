import React, { createContext, useState, useEffect, useContext } from 'react';
import validateToken from '../services/validateToken';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState({isAuthenticated: false});
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (token) => {
    localStorage.setItem('token', token);
    await isAuthenticated()
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({isAuthenticated: false});
    navigate('/login');
  };


  const isAuthenticated = async () => {
    try{
        setAuthLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        try {
            const decoded = await validateToken();
            setAuthState({isAuthenticated: true, email: decoded.email, verified: decoded.verified, name : decoded.name, id : decoded.id, business_name: decoded.business_name, role: decoded.role, phone: decoded.phone});
            return true;
        } catch (error) {
          let message = error.message;
          if (error.message === 'TypeError: Failed to fetch') message = 'Network error. Please check your connection and try again.';
          toast.error(message);
          throw new Error(message);
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    } finally {
        setAuthLoading(false);
    }
  };

  useEffect(() => {
    isAuthenticated()
  }, []);
  return (
    <AuthContext.Provider value={{ ...authState, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

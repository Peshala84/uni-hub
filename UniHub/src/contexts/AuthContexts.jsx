// src/contexts/AuthContexts.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // On app load, try to load token from localStorage and initialize auth state
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decoded.role.toLowerCase());
        setUserId(decoded.userId);
      } catch (err) {
        // Invalid token - clear
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
        setUserId(null);
      }
    }
  }, []);


  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setIsLoggedIn(true);
      setUserRole(decoded.role.toLowerCase());
      setUserId(decoded.userId);
    } catch (err) {
      console.error('Login failed: invalid token', err);
      setIsLoggedIn(false);
      setUserRole(null);
      setUserId(null);
      localStorage.removeItem('token');

    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

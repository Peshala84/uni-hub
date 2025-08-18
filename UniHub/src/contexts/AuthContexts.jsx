import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // 👈 only read here
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Optional: check expiration
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        setIsLoggedIn(true);
        setUserRole(decoded.role.toLowerCase());
        setUserId(decoded.userId);
      } catch (err) {
        console.error('Invalid token:', err);
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
        setUserId(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    sessionStorage.setItem('token', token); // 👈 store only in sessionStorage
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
      sessionStorage.removeItem('token');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token'); // 👈 clear sessionStorage
    setIsLoggedIn(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

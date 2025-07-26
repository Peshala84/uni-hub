import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lecturerData, setLecturerData] = useState(null);

  const login = (credentials) => {
    // Mock login - in real app, this would validate with backend
    setIsLoggedIn(true);
    setLecturerData({
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      department: 'Computer Science',
      phone: '+1 (555) 123-4567',
      office: 'CS Building, Room 301'
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLecturerData(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, lecturerData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
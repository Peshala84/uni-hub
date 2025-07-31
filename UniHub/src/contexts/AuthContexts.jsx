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
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'student' or 'lecturer'

  const login = (credentials,role) => {
    // Mock login - in real app, this would validate with backend
    setIsLoggedIn(true);
    setUserRole(role);
    
    if (role === 'lecturer') {
      setUserData({
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        department: 'Computer Science',
        phone: '+1 (555) 123-4567',
        office: 'CS Building, Room 301'
      });
    } else if (role === 'student') {
      setUserData({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@student.university.edu',
        studentId: 'STU2024001',
        year: '3rd Year',
        department: 'Computer Science'
      });
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
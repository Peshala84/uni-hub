import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, LogIn, BookMarked, Bell, User, Menu, X, Calendar, MessageSquare, Users, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';

const Navbar = () => {
  const { isLoggedIn, userRole, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!isLoggedIn) return [];

    if (userRole === 'lecturer') {
      return [
        { path: '/lecturer/home', icon: Home, label: 'Dashboard' },
        { path: '/lecturer/courses', icon: BookMarked, label: 'Courses' },
        { path: '/lecturer/notifications', icon: Bell, label: 'Notifications' },
        { path: '/lecturer/profile', icon: User, label: 'Profile' }
      ];
    }

    if (userRole === 'student') {
      return [
        { path: '/student/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/student/courses', icon: BookMarked, label: 'My Courses' },
        { path: '/student/calendar', icon: Calendar, label: 'Calendar' },
        { path: '/student/queries', icon: MessageSquare, label: 'Queries' },
        { path: '/student/announcements', icon: Bell, label: 'Announcements' },
        { path: '/student/profile', icon: User, label: 'Profile' }
      ];
    }

    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-500 border-gray-500shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 transition-colors bg-blue-600 rounded-lg group-hover:bg-blue-700">
              {userRole === 'lecturer' ? (
                <GraduationCap className="w-6 h-6 text-white" />
              ) : userRole === 'student' ? (
                <BookOpen className="w-6 h-6 text-white" />
              ) : (
                <BookOpen className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
              {userRole === 'lecturer' ? 'EduPortal - Lecturer' : userRole === 'student' ? 'EduPortal - Student' : 'EduPortal'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-1 md:flex">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath('/') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/lecturer/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath('/lecturer/login') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActivePath(item.path) 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 ml-2 space-x-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 transition-colors rounded-lg md:hidden hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="py-3 border-t border-gray-200 md:hidden">
            <div className="flex flex-col space-y-1">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActivePath('/') 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/lecturer/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActivePath('/lecturer/login') 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </>
              ) : (
                <>
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActivePath(item.path) 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 mx-4 mt-2 space-x-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
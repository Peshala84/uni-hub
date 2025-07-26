import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, LogIn, BookMarked, Bell, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-500 border-gray-500shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 transition-colors bg-blue-600 rounded-lg group-hover:bg-blue-700">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
              EduPortal
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
                  to="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath('/login') 
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
                <Link
                  to="/courses"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath('/courses') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <BookMarked className="w-4 h-4" />
                  <span>Courses</span>
                </Link>
                <Link
                  to="/notifications"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath('/notifications') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath('/profile') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
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
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActivePath('/login') 
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
                  <Link
                    to="/courses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActivePath('/courses') 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BookMarked className="w-4 h-4" />
                    <span>Courses</span>
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActivePath('/notifications') 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActivePath('/profile') 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
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
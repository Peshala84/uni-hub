import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Bell, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import

const Header = ({ sidebarOpen, setSidebarOpen, searchTerm, setSearchTerm }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  
  const navigate = useNavigate(); // Add this hook

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add this handler function
  const handleSignOutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Sign out clicked'); // Debug log
    setShowSignOutConfirm(true);
    setShowUserMenu(false); // Close user menu
  };

  const handleConfirmSignOut = () => {
    console.log('Confirming sign out'); // Debug log
    // Add any logout logic here (clear tokens, localStorage, etc.)
    // localStorage.removeItem('authToken'); // Example
    // sessionStorage.clear(); // Example
    setShowSignOutConfirm(false);
    navigate('/');
  };

  const handleCancelSignOut = () => {
    console.log('Canceling sign out'); // Debug log
    setShowSignOutConfirm(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#191E29]/95 backdrop-blur-xl shadow-2xl shadow-[#01C38D]/10' : 'bg-[#191E29]'
    } border-b border-[#132D46]/50`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 animate-pulse"></div>
      
      <div className="relative px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="group relative p-2 rounded-xl bg-gradient-to-br from-[#132D46] to-[#191E29] border border-[#01C38D]/20 hover:border-[#01C38D]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#01C38D]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  {sidebarOpen ? (
                    <X size={20} className="text-white group-hover:text-[#01C38D] transition-colors duration-300 group-hover:rotate-90 transform" />
                  ) : (
                    <Menu size={20} className="text-white group-hover:text-[#01C38D] transition-colors duration-300 group-hover:scale-110 transform" />
                  )}
                </div>
              </button>
              
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent animate-pulse">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            
            {/* Time Display - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-[#132D46]/50 rounded-full border border-[#01C38D]/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#01C38D] rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-[#01C38D]">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className={`relative w-full transition-all duration-500 ${
              isSearchFocused ? 'scale-105' : 'scale-100'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/20 to-[#132D46]/20 rounded-2xl blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative group">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  isSearchFocused ? 'text-[#01C38D] scale-110' : 'text-[#696E79]'
                }`} size={20} />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full pl-12 pr-6 py-3 bg-[#132D46]/70 backdrop-blur-sm border transition-all duration-300 rounded-2xl text-white placeholder-[#696E79] focus:outline-none ${
                    isSearchFocused 
                      ? 'border-[#01C38D] shadow-lg shadow-[#01C38D]/20 bg-[#132D46]/90' 
                      : 'border-[#696E79]/30 hover:border-[#01C38D]/50'
                  }`}
                />
                {isSearchFocused && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/10 to-transparent rounded-2xl animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Mobile Search Toggle */}
            <button className="md:hidden p-2 rounded-xl bg-[#132D46]/70 border border-[#01C38D]/20 hover:border-[#01C38D]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/20">
              <Search size={20} className="text-white hover:text-[#01C38D] transition-colors" />
            </button>

            {/* Notifications */}
            <div className="relative group">
              <button className="relative p-2 rounded-xl bg-gradient-to-br from-[#132D46]/70 to-[#191E29]/70 backdrop-blur-sm border border-[#01C38D]/20 hover:border-[#01C38D]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/20">
                <Bell size={20} className="text-white group-hover:text-[#01C38D] transition-colors duration-300 group-hover:animate-bounce" />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse border-2 border-[#191E29]">
                  3
                </div>
              </button>
              
              {/* Notification indicator pulse */}
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-[#01C38D]/30 rounded-full animate-ping"></div>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="group flex items-center space-x-3 p-2 pr-4 rounded-2xl bg-gradient-to-br from-[#132D46]/70 to-[#191E29]/70 backdrop-blur-sm border border-[#01C38D]/20 hover:border-[#01C38D]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/20"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#01C38D] to-[#01C38D]/80 rounded-full flex items-center justify-center shadow-lg shadow-[#01C38D]/20 group-hover:scale-110 transition-transform duration-300">
                    <User className="text-white" size={20} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#191E29] animate-pulse"></div>
                </div>
                
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-white">Admin User</p>
                  <p className="text-xs text-[#696E79]">Administrator</p>
                </div>
                
                <ChevronDown size={16} className={`text-[#696E79] group-hover:text-[#01C38D] transition-all duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#132D46]/95 backdrop-blur-xl border border-[#01C38D]/20 rounded-2xl shadow-2xl shadow-[#01C38D]/10 animate-in slide-in-from-top-5 duration-200 z-50">
                  <div className="p-1">
                    <div className="px-4 py-3 border-b border-[#01C38D]/10">
                      <p className="text-sm font-semibold text-white">Admin User</p>
                      <p className="text-xs text-[#696E79]">admin@company.com</p>
                    </div>
                    <button 
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#01C38D]/10 rounded-xl transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button 
                      type="button"
                      onClick={handleSignOutClick}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#01C38D]/10 rounded-xl transition-colors hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#696E79]" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#132D46]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden mt-3">
          <h1 className="text-lg font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#01C38D]/50 to-transparent"></div>
      
      {/* Click outside handler for user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#132D46] border border-[#01C38D]/20 rounded-2xl p-6 m-4 max-w-md w-full shadow-2xl shadow-[#01C38D]/10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-full flex items-center justify-center">
                <User className="text-[#01C38D]" size={32} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                Sign Out Confirmation
              </h3>
              
              <p className="text-[#696E79] mb-6">
                Are you sure you want to sign out? You'll need to log in again to access your dashboard.
              </p>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancelSignOut}
                  className="flex-1 px-4 py-3 bg-[#696E79]/20 hover:bg-[#696E79]/30 text-white rounded-xl transition-all duration-300 border border-[#696E79]/30 hover:border-[#696E79]/50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignOut}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
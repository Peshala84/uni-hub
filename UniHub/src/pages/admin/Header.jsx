// components/Header.js
import React from 'react';
import { Search, Menu, X, Bell, User } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, searchTerm, setSearchTerm }) => {
  return (
    <header className="bg-[#191E29] border-b border-[#132D46] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:text-[#01C38D] transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#696E79]" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#132D46] border border-[#696E79] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D]"
          />
        </div>
        <button className="relative text-white hover:text-[#01C38D] transition-colors">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 bg-[#01C38D] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
        </button>
        <div className="w-8 h-8 bg-[#01C38D] rounded-full flex items-center justify-center">
          <User className="text-white" size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;
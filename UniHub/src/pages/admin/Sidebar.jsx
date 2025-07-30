import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  GraduationCap,
  UserCheck,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  MessageSquare,
  FileText,
  ChevronRight,
  Zap,
  Circle
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [quickActions, setQuickActions] = useState(false);

  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      color: '#01C38D',
      description: 'Overview & Analytics'
    },
    { 
      id: 'add-user', 
      label: 'Add User', 
      icon: UserPlus, 
      color: '#3B82F6',
      description: 'Create New Account'
    },
    { 
      id: 'view-students', 
      label: 'View Students', 
      icon: GraduationCap, 
      color: '#F59E0B',
      description: 'Student Management'
    },
    { 
      id: 'view-lecturers', 
      label: 'View Lecturers', 
      icon: UserCheck, 
      color: '#8B5CF6',
      description: 'Faculty Overview'
    },
    { 
      id: 'queries', 
      label: 'Queries', 
      icon: MessageSquare, 
      color: '#EF4444',
      description: 'Support Tickets'
    },
    { 
      id: 'announcements', 
      label: 'Announcements', 
      icon: Bell, 
      color: '#10B981',
      description: 'Broadcast Messages'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      color: '#6B7280',
      description: 'System Configuration'
    }
  ];

  // Animated background effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getActiveItemIndex = () => {
    return sidebarItems.findIndex(item => item.id === activeTab);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed lg:relative z-50 bg-gradient-to-b from-[#132D46] via-[#132D46]/95 to-[#0F1419] border-r border-[#01C38D]/20 transition-all duration-500 ease-in-out min-h-screen overflow-hidden ${
          sidebarOpen ? 'w-72 sm:w-80' : 'w-16'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Animated background layers */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-full h-full opacity-20"
            style={{
              background: `conic-gradient(from ${animationPhase}deg, transparent, #01C38D10, transparent)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#01C38D]/5 via-transparent to-[#132D46]/10" />
        </div>

        {/* Active item indicator line */}
        <div 
          className="absolute left-0 w-1 bg-gradient-to-b from-[#01C38D] to-[#01C38D]/50 transition-all duration-500 ease-out rounded-r-full shadow-lg shadow-[#01C38D]/50"
          style={{
            height: '60px',
            top: `${120 + getActiveItemIndex() * 60}px`,
            opacity: activeTab ? 1 : 0
          }}
        />

        <div className="relative z-10 p-4 sm:p-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 sm:space-x-4 mb-8 sm:mb-10 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#01C38D] to-[#01C38D]/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-[#01C38D]/30 group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="text-white" size={sidebarOpen ? 28 : 24} />
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 bg-[#01C38D]/30 rounded-xl sm:rounded-2xl animate-ping" />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#01C38D]/20 to-transparent rounded-xl sm:rounded-2xl blur-lg" />
            </div>
            
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="animate-in slide-in-from-left duration-300">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent">
                    UniHUB
                  </h2>
                  <p className="text-xs text-[#696E79] font-medium tracking-wider">
                    ADMIN CONTROL
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Toggle */}
          {sidebarOpen && (
            <div className="mb-6 sm:mb-8">
              <button
                onClick={() => setQuickActions(!quickActions)}
                className="w-full flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-[#01C38D]/10 to-[#132D46]/20 border border-[#01C38D]/20 rounded-xl sm:rounded-2xl hover:from-[#01C38D]/20 hover:to-[#132D46]/30 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <Zap size={16} className="text-[#01C38D] group-hover:animate-pulse" />
                  <span className="text-white font-medium text-sm sm:text-base">Quick Actions</span>
                </div>
                <ChevronRight 
                  size={14} 
                  className={`text-[#696E79] transition-transform duration-300 ${
                    quickActions ? 'rotate-90' : ''
                  }`} 
                />
              </button>
              
              {quickActions && (
                <div className="mt-3 space-y-2 animate-in slide-in-from-top duration-200">
                  <button className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#696E79] hover:text-[#01C38D] hover:bg-[#01C38D]/5 rounded-lg transition-all">
                    Export Data
                  </button>
                  <button className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#696E79] hover:text-[#01C38D] hover:bg-[#01C38D]/5 rounded-lg transition-all">
                    Backup System
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-2 sm:space-y-3">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isHovered = hoveredItem === item.id;
              
              return (
                <div key={item.id} className="relative group">
                  {/* Hover background effect */}
                  {isHovered && (
                    <div 
                      className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-20 animate-pulse"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  
                  <button
                    onClick={() => setActiveTab(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#01C38D]/20 to-[#01C38D]/5 border border-[#01C38D]/30 shadow-lg shadow-[#01C38D]/10'
                        : 'hover:bg-gradient-to-r hover:from-[#191E29]/50 hover:to-[#132D46]/50 border border-transparent hover:border-[#01C38D]/10'
                    }`}
                  >
                    {/* Icon container */}
                    <div className="relative">
                      <div 
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br shadow-lg' 
                            : 'bg-[#191E29]/50 group-hover:bg-[#191E29]/80'
                        }`}
                        style={{
                          backgroundImage: isActive ? `linear-gradient(135deg, ${item.color}, ${item.color}80)` : undefined,
                          boxShadow: isActive ? `0 8px 25px ${item.color}30` : undefined
                        }}
                      >
                        <Icon 
                          size={18} 
                          className={`transition-all duration-300 ${
                            isActive 
                              ? 'text-white scale-110' 
                              : 'text-[#696E79] group-hover:text-white group-hover:scale-105'
                          }`}
                        />
                      </div>
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 rounded-full border-2 border-[#132D46] animate-pulse" />
                      )}
                    </div>

                    {/* Label and description */}
                    {sidebarOpen && (
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-[#696E79] group-hover:text-white'
                            }`}>
                              {item.label}
                            </h3>
                            <p className={`text-xs transition-colors duration-300 ${
                              isActive ? 'text-[#01C38D]/80' : 'text-[#696E79]/60 group-hover:text-[#696E79]'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Tooltip for collapsed state */}
                  {!sidebarOpen && isHovered && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-[#191E29] border border-[#01C38D]/20 rounded-lg shadow-2xl z-50 animate-in slide-in-from-left duration-200">
                      <div className="text-white font-medium text-sm whitespace-nowrap">
                        {item.label}
                      </div>
                      <div className="text-[#696E79] text-xs whitespace-nowrap">
                        {item.description}
                      </div>
                      {/* Arrow */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#191E29]" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom section */}
          {sidebarOpen && (
            <div className="mt-8 sm:mt-10 p-3 sm:p-4 bg-gradient-to-br from-[#01C38D]/10 to-[#132D46]/20 border border-[#01C38D]/20 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <Circle size={10} className="text-white fill-current" />
                </div>
                <div>
                  <p className="text-white font-medium text-xs sm:text-sm">System Status</p>
                  <p className="text-[#01C38D] text-xs font-semibold">All Systems Online</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Border glow effect */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#01C38D]/50 to-transparent" />
      </aside>
    </>
  );
};

export default Sidebar;
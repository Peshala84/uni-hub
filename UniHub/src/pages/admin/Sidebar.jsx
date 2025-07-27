// components/Sidebar.js
import React from 'react';
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
  FileText
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'add-user', label: 'Add User', icon: UserPlus },
    { id: 'view-students', label: 'View Students', icon: GraduationCap },
    { id: 'view-lecturers', label: 'View Lecturers', icon: UserCheck },
    { id: 'queries', label: 'Queries', icon: MessageSquare },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className={`bg-[#132D46] border-r border-[#191E29] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} min-h-screen`}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#01C38D] rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white" size={24} />
          </div>
          {sidebarOpen && <span className="text-white font-bold text-lg">EduPortal</span>}
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#01C38D] text-white' 
                    : 'text-[#696E79] hover:text-white hover:bg-[#191E29]'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
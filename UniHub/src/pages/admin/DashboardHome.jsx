// components/DashboardHome.js
import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  MessageSquare, 
  Calendar,
  UserPlus,
  Bell
} from 'lucide-react';

const DashboardHome = ({ students, lecturers, onNavigate }) => {
  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#132D46] rounded-xl p-6 border border-[#191E29]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#696E79] text-sm">Total Students</p>
            <p className="text-2xl font-bold text-white">{students.length}</p>
          </div>
          <div className="bg-[#01C38D] bg-opacity-20 p-3 rounded-lg">
            <GraduationCap className="text-[#01C38D]" size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-[#132D46] rounded-xl p-6 border border-[#191E29]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#696E79] text-sm">Total Lecturers</p>
            <p className="text-2xl font-bold text-white">{lecturers.length}</p>
          </div>
          <div className="bg-[#01C38D] bg-opacity-20 p-3 rounded-lg">
            <UserCheck className="text-[#01C38D]" size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-[#132D46] rounded-xl p-6 border border-[#191E29]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#696E79] text-sm">Active Queries</p>
            <p className="text-2xl font-bold text-white">24</p>
          </div>
          <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
            <MessageSquare className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-[#132D46] rounded-xl p-6 border border-[#191E29]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#696E79] text-sm">Pending Appointments</p>
            <p className="text-2xl font-bold text-white">8</p>
          </div>
          <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg">
            <Calendar className="text-red-500" size={24} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#132D46] rounded-xl p-6 border border-[#191E29]">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-[#191E29] rounded-lg">
                <div className="w-2 h-2 bg-[#01C38D] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">New student registered</p>
                  <p className="text-[#696E79] text-xs">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#132D46] rounded-xl p-6 border border-[#191E29]">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('add-user')}
              className="w-full flex items-center space-x-3 p-3 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors"
            >
              <UserPlus size={20} />
              <span>Add New User</span>
            </button>
            <button
              onClick={() => onNavigate('announcements')}
              className="w-full flex items-center space-x-3 p-3 border border-[#01C38D] text-[#01C38D] rounded-lg hover:bg-[#01C38D] hover:text-white transition-colors"
            >
              <Bell size={20} />
              <span>Send Announcement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
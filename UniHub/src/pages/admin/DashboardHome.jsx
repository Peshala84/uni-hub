import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap,
  UserX,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const SimpleDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    deactiveStudents: 0,
    activeLecturers: 0,
    deactiveLecturers: 0,
    totalAdmins: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8086/api/v1/admin/get_users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUsers(userData);
      
      // Calculate statistics
      const newStats = {
        totalUsers: userData.length,
        activeStudents: userData.filter(user => user.role === 'STUDENT' && user.status === 'ACTIVE').length,
        deactiveStudents: userData.filter(user => user.role === 'STUDENT' && user.status === 'DEACTIVATED').length,
        activeLecturers: userData.filter(user => user.role === 'LECTURER' && user.status === 'ACTIVE').length,
        deactiveLecturers: userData.filter(user => user.role === 'LECTURER' && user.status === 'DEACTIVATED').length,
        totalAdmins: userData.filter(user => user.role === 'ADMIN').length
      };
      
      setStats(newStats);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="group relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-2xl p-6 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/10">
      <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#696E79] mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color} border border-[#01C38D]/30`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const UserChart = () => {
    const chartData = [
      { label: 'Active Students', value: stats.activeStudents, color: '#01C38D' },
      { label: 'Deactive Students', value: stats.deactiveStudents, color: '#ef4444' },
      { label: 'Active Lecturers', value: stats.activeLecturers, color: '#3b82f6' },
      { label: 'Deactive Lecturers', value: stats.deactiveLecturers, color: '#f59e0b' }
    ];

    const maxValue = Math.max(...chartData.map(item => item.value));

    return (
      <div className="bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-2xl p-6 border border-[#01C38D]/20 shadow-lg shadow-[#01C38D]/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">User Distribution</h3>
          <div className="p-2 bg-[#01C38D]/20 rounded-xl border border-[#01C38D]/30">
            <BarChart3 size={20} className="text-[#01C38D]" />
          </div>
        </div>
        
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-32 text-sm font-medium text-[#696E79]">
                {item.label}
              </div>
              <div className="flex-1 bg-[#191E29]/60 rounded-full h-3 relative overflow-hidden border border-[#132D46]/50">
                <div 
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <div className="w-8 text-sm font-semibold text-white text-right">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RecentUsers = () => {
    const recentUsers = users.slice(-5).reverse();

    return (
      <div className="bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-2xl p-6 border border-[#01C38D]/20 shadow-lg shadow-[#01C38D]/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Users</h3>
          <div className="p-2 bg-[#01C38D]/20 rounded-xl border border-[#01C38D]/30">
            <Activity size={20} className="text-[#01C38D]" />
          </div>
        </div>
        
        <div className="space-y-3">
          {recentUsers.map((user) => (
            <div key={user.user_Id} className="flex items-center justify-between p-3 bg-[#191E29]/40 rounded-xl hover:bg-[#191E29]/60 transition-all duration-300 border border-[#132D46]/30 hover:border-[#01C38D]/20">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 ${
                  user.role === 'STUDENT' ? 'bg-gradient-to-br from-[#01C38D] to-[#01C38D]/80 border-[#01C38D]/30' :
                  user.role === 'LECTURER' ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500/30' : 
                  'bg-gradient-to-br from-[#696E79] to-[#696E79]/80 border-[#696E79]/30'
                }`}>
                  {user.f_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.f_name}</p>
                  <p className="text-xs text-[#696E79]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  user.status === 'ACTIVE' 
                    ? 'bg-[#01C38D]/20 text-[#01C38D] border-[#01C38D]/30' 
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {user.status}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-[#696E79]/20 text-[#696E79] rounded-full border border-[#696E79]/30">
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#191E29] to-[#132D46] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="animate-spin text-[#01C38D]" size={24} />
          <span className="text-[#696E79]">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#191E29] to-[#132D46] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <UserX size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Data</h2>
          <p className="text-[#696E79] mb-4">{error}</p>
          <button 
            onClick={fetchUsers}
            className="px-6 py-3 bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 text-white rounded-xl hover:shadow-lg hover:shadow-[#01C38D]/30 transition-all duration-300 border border-[#01C38D]/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191E29] to-[#132D46]">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#01C38D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#132D46]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#01C38D]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8 z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-gradient-to-br from-[#696E79]/80 to-[#696E79]/60"
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon={GraduationCap}
            color="bg-gradient-to-br from-[#01C38D]/80 to-[#01C38D]/60"
          />
          <StatCard
            title="Inactive Students"
            value={stats.deactiveStudents}
            icon={UserX}
            color="bg-gradient-to-br from-red-500/80 to-red-500/60"
          />
          <StatCard
            title="Active Lecturers"
            value={stats.activeLecturers}
            icon={UserCheck}
            color="bg-gradient-to-br from-blue-500/80 to-blue-500/60"
          />
          <StatCard
            title="Inactive Lecturers"
            value={stats.deactiveLecturers}
            icon={UserX}
            color="bg-gradient-to-br from-orange-500/80 to-orange-500/60"
          />
          <StatCard
            title="Administrators"
            value={stats.totalAdmins}
            icon={Users}
            color="bg-gradient-to-br from-purple-500/80 to-purple-500/60"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UserChart />
          <RecentUsers />
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
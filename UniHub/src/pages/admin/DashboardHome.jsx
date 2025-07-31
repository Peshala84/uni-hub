import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  MessageSquare, 
  Calendar,
  UserPlus,
  Bell,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Users,
  BookOpen,
  ClipboardList,
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  UserX,
  FileText,
  Zap,
  Award,
  Globe,
  Mail,
  Phone
} from 'lucide-react';

const DashboardHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sample data
  const [stats, setStats] = useState({
    totalStudents: 1247,
    totalLecturers: 89,
    activeQueries: 24,
    pendingAppointments: 8,
    completedAppointments: 156,
    systemHealth: 98.5
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
      {[
        {
          title: "Total Students",
          value: stats.totalStudents.toLocaleString(),
          icon: GraduationCap,
          color: "from-[#01C38D] to-[#01C38D]/80",
          bgColor: "from-[#01C38D]/20 to-[#01C38D]/10",
          trend: "+12%"
        },
        {
          title: "Total Lecturers",
          value: stats.totalLecturers.toLocaleString(),
          icon: UserCheck,
          color: "from-blue-500 to-blue-600",
          bgColor: "from-blue-500/20 to-blue-500/10",
          trend: "+5%"
        },
        {
          title: "Active Queries",
          value: stats.activeQueries.toLocaleString(),
          icon: MessageSquare,
          color: "from-yellow-500 to-yellow-600",
          bgColor: "from-yellow-500/20 to-yellow-500/10",
          trend: "-8%"
        },
        {
          title: "Pending Apps",
          value: stats.pendingAppointments.toLocaleString(),
          icon: Clock,
          color: "from-orange-500 to-orange-600",
          bgColor: "from-orange-500/20 to-orange-500/10",
          trend: "+3%"
        },
        {
          title: "Completed",
          value: stats.completedAppointments.toLocaleString(),
          icon: CheckCircle,
          color: "from-green-500 to-green-600",
          bgColor: "from-green-500/20 to-green-500/10",
          trend: "+24%"
        },
        {
          title: "System Health",
          value: `${stats.systemHealth}%`,
          icon: Activity,
          color: "from-purple-500 to-purple-600",
          bgColor: "from-purple-500/20 to-purple-500/10",
          trend: "+0.5%"
        }
      ].map((stat, index) => (
        <div key={index} className="group relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-6 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${stat.bgColor} rounded-2xl border border-${stat.color.split(' ')[1].replace('to-', '').replace('/80', '')}/30`}>
                <stat.icon className={`text-${stat.color.split(' ')[1].replace('to-', '').replace('/80', '')}`} size={24} />
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
              }`}>
                {stat.trend}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="text-[#696E79] font-medium text-sm">{stat.title}</div>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}/50 to-transparent rounded-full`}></div>
        </div>
      ))}
    </div>
  );

  const RecentActivities = () => (
    <div className="relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#01C38D]/20 shadow-2xl shadow-[#01C38D]/5">
      <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 animate-pulse rounded-3xl"></div>
      
      <div className="relative">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl border border-[#01C38D]/30">
            <Activity className="text-[#01C38D]" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Recent Activities</h3>
            <p className="text-[#696E79]">Latest system events and updates</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            {
              type: 'student',
              message: 'New student "John Doe" registered for Computer Science',
              time: '2 minutes ago',
              icon: UserPlus,
              color: 'text-green-400',
              bgColor: 'bg-green-400/10'
            },
            {
              type: 'query',
              message: 'Query submitted: "Registration Process for MBA"',
              time: '5 minutes ago',
              icon: MessageSquare,
              color: 'text-yellow-400',
              bgColor: 'bg-yellow-400/10'
            },
            {
              type: 'appointment',
              message: 'Appointment scheduled with Dr. Smith for career guidance',
              time: '10 minutes ago',
              icon: Calendar,
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10'
            },
            {
              type: 'lecturer',
              message: 'Lecturer "Prof. Johnson" updated course materials',
              time: '15 minutes ago',
              icon: BookOpen,
              color: 'text-purple-400',
              bgColor: 'bg-purple-400/10'
            },
            {
              type: 'system',
              message: 'System backup completed successfully',
              time: '30 minutes ago',
              icon: CheckCircle,
              color: 'text-[#01C38D]',
              bgColor: 'bg-[#01C38D]/10'
            }
          ].map((activity, index) => (
            <div key={index} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-[#132D46]/60 to-[#191E29]/40 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/10">
              <div className={`p-2 ${activity.bgColor} rounded-xl border border-${activity.color.replace('text-', '').replace('-400', '-500')}/30`}>
                <activity.icon className={`${activity.color}`} size={18} />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{activity.message}</p>
                <p className="text-[#696E79] text-xs mt-1">{activity.time}</p>
              </div>
              <div className="w-2 h-2 bg-[#01C38D] rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#01C38D]/20 shadow-2xl shadow-[#01C38D]/5">
      <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 animate-pulse rounded-3xl"></div>
      
      <div className="relative">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl border border-[#01C38D]/30">
            <Zap className="text-[#01C38D]" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
            <p className="text-[#696E79]">Frequently used admin functions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Add New Student',
              description: 'Register a new student account',
              icon: UserPlus,
              color: 'from-[#01C38D] to-[#01C38D]/80',
              action: () => console.log('Add student')
            },
            {
              title: 'Add New Lecturer',
              description: 'Register a new lecturer account',
              icon: UserCheck,
              color: 'from-blue-500 to-blue-600',
              action: () => console.log('Add lecturer')
            },
            {
              title: 'Send Announcement',
              description: 'Broadcast message to all users',
              icon: Bell,
              color: 'from-yellow-500 to-yellow-600',
              action: () => console.log('Send announcement')
            },
            {
              title: 'View Reports',
              description: 'Generate system reports',
              icon: BarChart3,
              color: 'from-purple-500 to-purple-600',
              action: () => console.log('View reports')
            },
            {
              title: 'Manage Queries',
              description: 'Handle pending student queries',
              icon: MessageSquare,
              color: 'from-orange-500 to-orange-600',
              action: () => console.log('Manage queries')
            },
            {
              title: 'System Settings',
              description: 'Configure system parameters',
              icon: Settings,
              color: 'from-red-500 to-red-600',
              action: () => console.log('System settings')
            }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`group relative p-6 bg-gradient-to-r ${action.color} text-white rounded-2xl hover:shadow-2xl hover:shadow-${action.color.split(' ')[1].replace('to-', '').replace('/80', '').replace('/600', '')}/30 transition-all duration-500 hover:scale-105 overflow-hidden text-left`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-start space-x-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <action.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">{action.title}</h4>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191E29] to-[#132D46]">
      <div className="relative">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#01C38D]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#132D46]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#01C38D]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Welcome Section */}
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent mb-4">
                    Welcome back, Dr. Sarah
                  </h1>
                  <p className="text-[#696E79] text-lg">
                    Here's what's happening at UniHUB today - {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="px-6 py-3 bg-gradient-to-r from-[#01C38D]/20 to-[#01C38D]/10 border border-[#01C38D]/30 text-[#01C38D] rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Activity size={16} />
                      <span className="font-semibold">System Status: Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <DashboardStats />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              
              {/* Recent Activities - Takes 2 columns on xl screens */}
              <div className="xl:col-span-2">
                <RecentActivities />
              </div>

              {/* Quick Actions - Takes 1 column on xl screens */}
              <div className="xl:col-span-1">
                <QuickActions />
              </div>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;
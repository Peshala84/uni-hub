import React, { useState, useCallback, useEffect } from 'react';
import { Plus, X, GraduationCap, UserCheck, Sparkles, Users, Award, BookOpen, Star } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onSubmit, loading, error, success }) => {
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    NIC: '',
    address: '',
    contact: '',
    DOB: '',
    role: 'STUDENT'
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  const handleClose = useCallback(() => {
    setFormData({
      f_name: '',
      l_name: '',
      email: '',
      NIC: '',
      address: '',
      contact: '',
      DOB: '',
      role: 'STUDENT'
    });
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-[#132D46]/95 to-[#191E29]/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg mx-4 border border-[#01C38D]/20 shadow-2xl shadow-[#01C38D]/10 animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl animate-pulse"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl border border-[#01C38D]/30">
              <Plus className="text-[#01C38D]" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent">
                Add New User
              </h3>
              <p className="text-[#696E79] text-sm">Create a new account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="group relative p-2 rounded-xl bg-gradient-to-br from-[#132D46] to-[#191E29] border border-[#01C38D]/20 hover:border-[#01C38D]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/20"
            disabled={loading}
            type="button"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#01C38D]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <X size={20} className="relative text-[#696E79] group-hover:text-white transition-all duration-300 group-hover:rotate-90" />
          </button>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="relative mb-6 p-4 bg-gradient-to-r from-green-900/50 to-green-800/30 border border-green-500/30 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top-5 duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent rounded-2xl animate-pulse"></div>
            <div className="relative flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-green-200 text-sm font-medium">{success}</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="relative mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/30 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top-5 duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-transparent rounded-2xl animate-pulse"></div>
            <div className="relative flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="First Name *"
                value={formData.f_name}
                onChange={(e) => handleInputChange('f_name', e.target.value)}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
                required
                disabled={loading}
                autoComplete="given-name"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <div className="relative group">
              <input
                type="text"
                placeholder="Last Name"
                value={formData.l_name}
                onChange={(e) => handleInputChange('l_name', e.target.value)}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
                disabled={loading}
                autoComplete="family-name"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
          
          <div className="relative group">
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
              required
              disabled={loading}
              autoComplete="email"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="NIC *"
                value={formData.NIC}
                onChange={(e) => handleInputChange('NIC', e.target.value)}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
                required
                disabled={loading}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <div className="relative group">
              <input
                type="text"
                placeholder="Address *"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
                required
                disabled={loading}
                autoComplete="address-line1"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <div className="relative group">
              <input
                type="tel"
                placeholder="Contact *"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
                required
                disabled={loading}
                autoComplete="tel"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <div className="relative group">
              <input
                type="date"
                value={formData.DOB}
                onChange={(e) => handleInputChange('DOB', e.target.value)}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
                required
                disabled={loading}
                autoComplete="bday"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <div className="relative group">
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 group-hover:border-[#01C38D]/50"
                disabled={loading}
              >
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
              </select>
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 relative group px-6 py-3 bg-gradient-to-br from-[#132D46]/70 to-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 text-[#696E79] rounded-2xl hover:border-[#01C38D]/50 hover:text-white transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#01C38D]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 relative group px-6 py-3 bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 text-white rounded-2xl hover:shadow-lg hover:shadow-[#01C38D]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Create User</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddUser = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    lecturers: 0,
    activeUsers: 0
  });
  const [realStats, setRealStats] = useState({
    students: 0,
    lecturers: 0,
    activeUsers: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch user statistics from API
  const fetchUserStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('http://localhost:8086/api/v1/admin/get_users');
      
      if (response.ok) {
        const users = await response.json();
        
        // Calculate statistics from the user data
        const studentCount = users.filter(user => user.role === 'STUDENT').length;
        const lecturerCount = users.filter(user => user.role === 'LECTURER').length;
        const activeUserCount = users.filter(user => user.status === 'ACTIVE').length;
        
        setRealStats({
          students: studentCount,
          lecturers: lecturerCount,
          activeUsers: activeUserCount
        });
        
        console.log('User statistics:', {
          total: users.length,
          students: studentCount,
          lecturers: lecturerCount,
          active: activeUserCount
        });
      } else {
        console.error('Failed to fetch user statistics');
        // Fallback to default values if API fails
        setRealStats({
          students: 0,
          lecturers: 0,
          activeUsers: 0
        });
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      // Fallback to default values if API fails
      setRealStats({
        students: 0,
        lecturers: 0,
        activeUsers: 0
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Animated stats effect with real data
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    if (!statsLoading && realStats) {
      const duration = 2000;
      const increment = 50;

      const animateValue = (key, target) => {
        let current = 0;
        const step = target / (duration / increment);
        
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, increment);
      };

      Object.entries(realStats).forEach(([key, value]) => {
        animateValue(key, value);
      });
    }
  }, [realStats, statsLoading]);

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Sending user data:', userData);

      const response = await fetch('http://localhost:8086/api/v1/admin/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid response format from server');
        }

        setSuccess('User created successfully!');
        // Refresh stats after successful user creation
        setTimeout(() => {
          fetchUserStats(); // Refresh the stats
          setShowAddUserModal(false);
          setSuccess('');
          setError('');
        }, 2000);
        return { success: true, data };
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Failed to create user';
        } catch (parseError) {
          errorMessage = responseText || 'Failed to create user';
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'An error occurred while creating the user');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddUserModal(false);
    setError('');
    setSuccess('');
  }, []);

  const handleOpenModal = useCallback(() => {
    setShowAddUserModal(true);
    setError('');
    setSuccess('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191E29] to-[#132D46] p-6">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#01C38D]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#132D46]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#01C38D]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Header Section */}
        <div className="relative mb-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-3xl border border-[#01C38D]/30 shadow-lg shadow-[#01C38D]/10">
                  <Users className="text-[#01C38D]" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent animate-pulse">
                    User Management
                  </h1>
                  <p className="text-[#696E79] text-lg mt-2">Create and manage user accounts effortlessly</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleOpenModal}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 text-white rounded-2xl hover:shadow-2xl hover:shadow-[#01C38D]/30 transition-all duration-500 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Plus size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Add New User</div>
                  <div className="text-sm opacity-90">Create Account</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {statsLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 border-2 border-[#01C38D]/30 border-t-[#01C38D] rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    animatedStats.students.toLocaleString()
                  )}
                </div>
                <div className="text-[#696E79] font-medium">Total Students</div>
                {!statsLoading && (
                  <div className="text-xs text-[#01C38D] mt-1 opacity-75">
                    Live count from database
                  </div>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl">
                <GraduationCap className="text-[#01C38D]" size={32} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01C38D]/50 to-transparent rounded-full"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {statsLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 border-2 border-[#01C38D]/30 border-t-[#01C38D] rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    animatedStats.lecturers.toLocaleString()
                  )}
                </div>
                <div className="text-[#696E79] font-medium">Total Lecturers</div>
                {!statsLoading && (
                  <div className="text-xs text-[#01C38D] mt-1 opacity-75">
                    Live count from database
                  </div>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl">
                <UserCheck className="text-[#01C38D]" size={32} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01C38D]/50 to-transparent rounded-full"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {statsLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 border-2 border-[#01C38D]/30 border-t-[#01C38D] rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    animatedStats.activeUsers.toLocaleString()
                  )}
                </div>
                <div className="text-[#696E79] font-medium">Active Users</div>
                {!statsLoading && (
                  <div className="text-xs text-[#01C38D] mt-1 opacity-75">
                    Currently active accounts
                  </div>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl">
                <Star className="text-[#01C38D]" size={32} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01C38D]/50 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-[#01C38D]/20 shadow-2xl shadow-[#01C38D]/5">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl animate-pulse"></div>
          
          <div className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-[#01C38D]/10 rounded-full border border-[#01C38D]/20 mb-6">
                <Sparkles className="text-[#01C38D]" size={20} />
                <span className="text-[#01C38D] font-medium">Account Creation</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Choose Account Type
              </h2>
              <p className="text-[#696E79] text-lg max-w-2xl mx-auto">
                Create new accounts for students and lecturers with appropriate access levels and permissions
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Card */}
              <div className="group relative bg-gradient-to-br from-[#132D46]/60 to-[#191E29]/40 backdrop-blur-sm rounded-3xl p-8 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center">
                  <div className="inline-flex p-6 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-3xl border border-[#01C38D]/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap className="text-[#01C38D]" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Student Accounts</h3>
                  <p className="text-[#696E79] leading-relaxed mb-6">
                    Create student accounts with access to learning resources, assignments, and course materials
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-[#01C38D]">
                      <BookOpen size={16} />
                      <span>Course Access</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-[#01C38D]">
                      <Award size={16} />
                      <span>Assignment Submission</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01C38D]/50 to-transparent rounded-full"></div>
              </div>

              {/* Lecturer Card */}
              <div className="group relative bg-gradient-to-br from-[#132D46]/60 to-[#191E29]/40 backdrop-blur-sm rounded-3xl p-8 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center">
                  <div className="inline-flex p-6 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-3xl border border-[#01C38D]/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <UserCheck className="text-[#01C38D]" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Lecturer Accounts</h3>
                  <p className="text-[#696E79] leading-relaxed mb-6">
                    Create lecturer accounts with teaching privileges, course management, and student assessment tools
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-[#01C38D]">
                      <Users size={16} />
                      <span>Course Management</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-[#01C38D]">
                      <Star size={16} />
                      <span>Student Assessment</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01C38D]/50 to-transparent rounded-full"></div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-[#01C38D]/10 rounded-full border border-[#01C38D]/20 mb-8">
                <Sparkles className="text-[#01C38D]" size={20} />
                <span className="text-[#01C38D] font-medium">Platform Features</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-[#01C38D]" size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-2">User Management</h4>
                  <p className="text-[#696E79] text-sm">Comprehensive user account creation and management system</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="text-[#01C38D]" size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Role-Based Access</h4>
                  <p className="text-[#696E79] text-sm">Different permission levels for students and lecturers</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="text-[#01C38D]" size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Learning Platform</h4>
                  <p className="text-[#696E79] text-sm">Integrated learning management and course delivery system</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#01C38D]/50 to-transparent"></div>
      </div>
      
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={handleCloseModal}
        onSubmit={createUser}
        loading={loading}
        error={error}
        success={success}
      />
    </div>
  );
};

export default AddUser;
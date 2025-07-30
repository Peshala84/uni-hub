import React, { useState, useEffect, useCallback } from 'react';
import { Download, Filter, Eye, RefreshCw, UserCheck, UserX, X, Search, Users, GraduationCap, Activity, Calendar, Mail, Phone, MapPin, Hash, User, ChevronUp, ChevronDown } from 'lucide-react';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('f_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching students...');
      const response = await fetch('http://localhost:8086/api/v1/admin/view_students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
        
        const normalized = Array.isArray(data)
          ? data.map(student => ({
              ...student,
              is_active: student.status === 'ACTIVE'
            }))
          : [];
        
        console.log('Normalized students data:', normalized);
        setStudents(normalized);
        setFilteredStudents(normalized);
        
        // Calculate stats
        const activeCount = normalized.filter(s => s.is_active).length;
        setStats({
          total: normalized.length,
          active: activeCount,
          inactive: normalized.length - activeCount
        });
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Failed to fetch students';
        } catch (parseError) {
          errorMessage = responseText || 'Failed to fetch students';
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'An error occurred while fetching students');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = students;
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => 
        filterStatus === 'active' ? student.is_active : !student.is_active
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        (student.f_name && student.f_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.l_name && student.l_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.NIC && student.NIC.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.contact && student.contact.includes(searchTerm))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredStudents(filtered);
  }, [students, searchTerm, filterStatus, sortField, sortDirection]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleExport = useCallback(() => {
    console.log('Export students data');
    // TODO: Implement export functionality
  }, []);

  const handleView = useCallback((student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  }, []);

  const handleActivationToggle = useCallback((student) => {
    setSelectedStudent(student);
    setConfirmAction(student.is_active ? 'deactivate' : 'activate');
    setShowConfirmModal(true);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!selectedStudent || !confirmAction) return;
    
    try {
      setActionLoading(true);
      
      const endpoint = confirmAction === 'deactivate'
        ? 'http://localhost:8086/api/v1/admin/deactivate_user'
        : 'http://localhost:8086/api/v1/admin/reactivate_user';
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_Id: selectedStudent.user_Id
        }),
      });
      
      const responseText = await response.text();
      
      if (response.ok) {
        await fetchStudents();
        setShowConfirmModal(false);
        setSelectedStudent(null);
        setConfirmAction(null);
        console.log(`Student ${confirmAction}d successfully`);
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || `Failed to ${confirmAction} student`;
        } catch (parseError) {
          errorMessage = responseText || `Failed to ${confirmAction} student`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error(`Error ${confirmAction}ing student:`, err);
      setError(err.message || `An error occurred while ${confirmAction}ing the student`);
    } finally {
      setActionLoading(false);
    }
  }, [selectedStudent, confirmAction, fetchStudents]);

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedStudent(null);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedStudent(null);
    setConfirmAction(null);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-[#696E79] opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-[#01C38D]" /> : 
      <ChevronDown className="w-4 h-4 text-[#01C38D]" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191E29] to-[#132D46] p-6">
      <div className="relative max-w-7xl mx-auto">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#01C38D]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#132D46]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#01C38D]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Header Section */}
        <div className="relative mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-3xl border border-[#01C38D]/30 shadow-lg shadow-[#01C38D]/10">
                <GraduationCap className="text-[#01C38D]" size={32} />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent animate-pulse">
                  Student Management
                </h1>
                <p className="text-[#696E79] text-lg mt-2">View and manage all student accounts</p>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 text-white rounded-2xl hover:shadow-2xl hover:shadow-[#01C38D]/30 transition-all duration-500 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center space-x-3">
                <RefreshCw size={20} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                <span className="font-semibold">{loading ? 'Refreshing...' : 'Refresh Data'}</span>
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
                  {stats.total.toLocaleString()}
                </div>
                <div className="text-[#696E79] font-medium">Total Students</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl">
                <Users className="text-[#01C38D]" size={32} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01C38D]/50 to-transparent rounded-full"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">
                  {stats.active.toLocaleString()}
                </div>
                <div className="text-[#696E79] font-medium">Active Students</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl">
                <UserCheck className="text-green-400" size={32} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/50 to-transparent rounded-full"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#01C38D]/20 hover:border-[#01C38D]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#01C38D]/10 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-red-400 mb-2">
                  {stats.inactive.toLocaleString()}
                </div>
                <div className="text-[#696E79] font-medium">Inactive Students</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl">
                <UserX className="text-red-400" size={32} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400/50 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="relative mb-8 p-4 bg-gradient-to-r from-red-900/50 to-red-800/30 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top-5 duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-transparent rounded-2xl animate-pulse"></div>
            <div className="relative flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative bg-gradient-to-br from-[#132D46]/80 to-[#191E29]/60 backdrop-blur-xl rounded-3xl border border-[#01C38D]/20 shadow-2xl shadow-[#01C38D]/5 overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 animate-pulse"></div>
          
          {/* Header */}
          <div className="relative p-8 border-b border-[#01C38D]/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl border border-[#01C38D]/30">
                  <Activity className="text-[#01C38D]" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Student Directory
                  </h3>
                  <p className="text-[#696E79]">Showing {filteredStudents.length} of {students.length} students</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#696E79] group-focus-within:text-[#01C38D] transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 min-w-[280px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Filter */}
                <div className="relative group">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-6 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 rounded-2xl text-white focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 appearance-none cursor-pointer min-w-[140px]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#696E79] pointer-events-none" size={16} />
                </div>

                {/* Export Button */}
                <button 
                  onClick={handleExport}
                  className="group relative px-6 py-3 bg-gradient-to-r from-[#01C38D]/20 to-[#01C38D]/10 border border-[#01C38D]/30 text-[#01C38D] rounded-2xl hover:bg-gradient-to-r hover:from-[#01C38D] hover:to-[#01C38D]/80 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  <div className="relative flex items-center space-x-2">
                    <Download size={16} />
                    <span className="font-medium">Export</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && students.length === 0 ? (
            <div className="relative text-center py-16">
              <div className="inline-flex items-center space-x-4">
                <div className="w-8 h-8 border-2 border-[#01C38D]/30 border-t-[#01C38D] rounded-full animate-spin"></div>
                <p className="text-[#696E79] text-lg">Loading students...</p>
              </div>
            </div>
          ) : (
            /* Students Table */
            <div className="relative">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-3xl border border-[#01C38D]/30 mb-6">
                    <Users className="text-[#01C38D]" size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Students Found</h3>
                  <p className="text-[#696E79]">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'No students have been added yet'
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#01C38D]/20">
                        <th className="text-left p-6">
                          <button
                            onClick={() => handleSort('f_name')}
                            className="group flex items-center space-x-2 text-[#696E79] hover:text-[#01C38D] transition-colors"
                          >
                            <span className="font-medium uppercase text-sm tracking-wider">Name</span>
                            <SortIcon field="f_name" />
                          </button>
                        </th>
                        <th className="text-left p-6">
                          <button
                            onClick={() => handleSort('email')}
                            className="group flex items-center space-x-2 text-[#696E79] hover:text-[#01C38D] transition-colors"
                          >
                            <span className="font-medium uppercase text-sm tracking-wider">Email</span>
                            <SortIcon field="email" />
                          </button>
                        </th>
                        <th className="text-left p-6">
                          <button
                            onClick={() => handleSort('contact')}
                            className="group flex items-center space-x-2 text-[#696E79] hover:text-[#01C38D] transition-colors"
                          >
                            <span className="font-medium uppercase text-sm tracking-wider">Contact</span>
                            <SortIcon field="contact" />
                          </button>
                        </th>
                        <th className="text-left p-6">
                          <button
                            onClick={() => handleSort('NIC')}
                            className="group flex items-center space-x-2 text-[#696E79] hover:text-[#01C38D] transition-colors"
                          >
                            <span className="font-medium uppercase text-sm tracking-wider">NIC</span>
                            <SortIcon field="NIC" />
                          </button>
                        </th>
                        <th className="text-left p-6">
                          <button
                            onClick={() => handleSort('is_active')}
                            className="group flex items-center space-x-2 text-[#696E79] hover:text-[#01C38D] transition-colors"
                          >
                            <span className="font-medium uppercase text-sm tracking-wider">Status</span>
                            <SortIcon field="is_active" />
                          </button>
                        </th>
                        <th className="text-center p-6">
                          <span className="font-medium uppercase text-sm tracking-wider text-[#696E79]">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr key={student.user_Id} className={`group border-b border-[#01C38D]/10 hover:bg-gradient-to-r hover:from-[#01C38D]/5 hover:to-transparent transition-all duration-300 ${index % 2 === 0 ? 'bg-[#132D46]/20' : 'bg-transparent'}`}>
                          <td className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#01C38D] to-[#01C38D]/80 rounded-xl flex items-center justify-center shadow-md">
                                  <span className="text-white font-semibold text-sm">
                                    {student.f_name ? student.f_name.charAt(0) : 'S'}
                                    {student.l_name && student.l_name.charAt(0)}
                                  </span>
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${student.is_active ? 'bg-green-400' : 'bg-red-400'} rounded-full border-2 border-[#132D46]`}></div>
                              </div>
                              <div>
                                <div className="text-white font-semibold">
                                  {student.f_name || 'Unknown'} {student.l_name || ''}
                                </div>
                                <div className="text-[#696E79] text-sm font-mono">ID: {student.user_Id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="text-white">{student.email || 'N/A'}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-white font-mono">{student.contact || 'N/A'}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-white font-mono">{student.NIC || 'N/A'}</div>
                          </td>
                          <td className="p-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              student.is_active 
                                ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-900/20 text-red-400 border border-red-500/30'
                            }`}>
                              {student.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                onClick={() => handleView(student)}
                                className="group/btn relative p-2 bg-gradient-to-r from-[#01C38D]/20 to-[#01C38D]/10 border border-[#01C38D]/30 text-[#01C38D] rounded-lg hover:bg-gradient-to-r hover:from-[#01C38D] hover:to-[#01C38D]/80 hover:text-white transition-all duration-300 overflow-hidden"
                                title="View Details"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                                <Eye size={16} className="relative" />
                              </button>
                              <button 
                                onClick={() => handleActivationToggle(student)}
                                className={`group/btn relative p-2 rounded-lg transition-all duration-300 overflow-hidden ${
                                  student.is_active 
                                    ? 'bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30 text-red-400 hover:from-red-500 hover:to-red-500/80 hover:text-white' 
                                    : 'bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30 text-green-400 hover:from-green-500 hover:to-green-500/80 hover:text-white'
                                }`}
                                title={student.is_active ? 'Deactivate Student' : 'Activate Student'}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                                {student.is_active ? <UserX size={16} className="relative" /> : <UserCheck size={16} className="relative" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Student Modal */}
        {showViewModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
            <div className="relative bg-gradient-to-br from-[#132D46]/95 to-[#191E29]/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#01C38D]/20 shadow-2xl shadow-[#01C38D]/10 animate-in slide-in-from-bottom-10 duration-500">
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl animate-pulse"></div>
              
              {/* Header */}
              <div className="relative flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl border border-[#01C38D]/30">
                    <User className="text-[#01C38D]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent">
                      Student Details
                    </h3>
                    <p className="text-[#696E79]">Complete student information</p>
                  </div>
                </div>
                <button 
                  onClick={closeViewModal}
                  className="group relative p-2 rounded-xl bg-gradient-to-br from-[#132D46] to-[#191E29] border border-[#01C38D]/20 hover:border-[#01C38D]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#01C38D]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <X size={20} className="relative text-[#696E79] group-hover:text-white transition-all duration-300 group-hover:rotate-90" />
                </button>
              </div>
              
              {/* Student Profile Section */}
              <div className="relative mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-gradient-to-br from-[#132D46]/60 to-[#191E29]/40 rounded-3xl border border-[#01C38D]/20">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#01C38D] to-[#01C38D]/80 rounded-3xl flex items-center justify-center shadow-lg shadow-[#01C38D]/20">
                      <span className="text-white font-bold text-2xl">
                        {selectedStudent.f_name ? selectedStudent.f_name.charAt(0) : 'S'}
                        {selectedStudent.l_name && selectedStudent.l_name.charAt(0)}
                      </span>
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${selectedStudent.is_active ? 'bg-green-400' : 'bg-red-400'} rounded-full border-2 border-[#132D46] animate-pulse`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {selectedStudent.f_name || 'Unknown'} {selectedStudent.l_name || ''}
                    </h4>
                    <div className="flex items-center space-x-3 mb-3">
                      <Mail className="text-[#696E79]" size={16} />
                      <p className="text-[#01C38D]">{selectedStudent.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      selectedStudent.is_active 
                        ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-900/20 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedStudent.is_active ? 'Active Account' : 'Inactive Account'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Information Grid */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <Hash className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">User ID</h5>
                    </div>
                    <p className="text-white text-lg font-mono">{selectedStudent.user_Id || 'N/A'}</p>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <User className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">First Name</h5>
                    </div>
                    <p className="text-white text-lg">{selectedStudent.f_name || 'N/A'}</p>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <Mail className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">Email Address</h5>
                    </div>
                    <p className="text-white text-lg break-all">{selectedStudent.email || 'N/A'}</p>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <Hash className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">NIC Number</h5>
                    </div>
                    <p className="text-white text-lg font-mono">{selectedStudent.NIC || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <GraduationCap className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">Student ID</h5>
                    </div>
                    <p className="text-white text-lg font-mono">{selectedStudent.student_Id || 'Not Assigned'}</p>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <User className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">Last Name</h5>
                    </div>
                    <p className="text-white text-lg">{selectedStudent.l_name || 'N/A'}</p>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <Phone className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">Contact Number</h5>
                    </div>
                    <p className="text-white text-lg font-mono">{selectedStudent.contact || 'N/A'}</p>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                        <Calendar className="text-[#01C38D]" size={16} />
                      </div>
                      <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">Date of Birth</h5>
                    </div>
                    <p className="text-white text-lg">{selectedStudent.DOB || 'N/A'}</p>
                  </div>
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2 group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-lg">
                      <MapPin className="text-[#01C38D]" size={16} />
                    </div>
                    <h5 className="text-[#696E79] font-medium uppercase text-sm tracking-wider">Address</h5>
                  </div>
                  <p className="text-white text-lg leading-relaxed">{selectedStudent.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedStudent && confirmAction && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
            <div className="relative bg-gradient-to-br from-[#132D46]/95 to-[#191E29]/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-[#01C38D]/20 shadow-2xl shadow-[#01C38D]/10 animate-in slide-in-from-bottom-10 duration-500">
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#01C38D]/5 via-transparent to-[#132D46]/10 rounded-3xl animate-pulse"></div>
              
              <div className="relative text-center">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-2xl mb-6 ${
                  confirmAction === 'deactivate' 
                    ? 'bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30' 
                    : 'bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30'
                }`}>
                  {confirmAction === 'deactivate' ? 
                    <UserX className="h-8 w-8 text-red-400" /> : 
                    <UserCheck className="h-8 w-8 text-green-400" />
                  }
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {confirmAction === 'deactivate' ? 'Deactivate' : 'Activate'} Student
                </h3>
                
                <div className="mb-8">
                  <p className="text-[#696E79] mb-4">
                    Are you sure you want to {confirmAction}{' '}
                    <span className="text-white font-semibold">
                      {selectedStudent.f_name} {selectedStudent.l_name}
                    </span>?
                  </p>
                  <div className={`p-4 rounded-2xl border ${
                    confirmAction === 'deactivate'
                      ? 'bg-red-900/20 border-red-500/30'
                      : 'bg-green-900/20 border-green-500/30'
                  }`}>
                    <p className={`text-sm ${
                      confirmAction === 'deactivate' ? 'text-red-200' : 'text-green-200'
                    }`}>
                      {confirmAction === 'deactivate' 
                        ? 'This will prevent the student from logging into their account.' 
                        : 'This will restore the student\'s access to their account.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={closeConfirmModal}
                    disabled={actionLoading}
                    className="flex-1 relative group px-6 py-3 bg-gradient-to-br from-[#132D46]/70 to-[#191E29]/70 backdrop-blur-sm border border-[#696E79]/30 text-[#696E79] rounded-2xl hover:border-[#01C38D]/50 hover:text-white transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#01C38D]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">Cancel</span>
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={actionLoading}
                    className={`flex-1 relative group px-6 py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                      confirmAction === 'deactivate'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/30 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/30 text-white'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      {actionLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          {confirmAction === 'deactivate' ? 'Deactivate' : 'Activate'}
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#01C38D]/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default ViewStudents;
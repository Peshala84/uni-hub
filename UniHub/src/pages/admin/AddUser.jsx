import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, User, Save, AlertCircle, CheckCircle, Users, GraduationCap, Award, Star, Sparkles } from 'lucide-react';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    name: '',
    credits: '',
    year: '',
    semester: '',
    lecturerId: ''
  });
  
  const [availableLecturers, setAvailableLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animatedStats, setAnimatedStats] = useState({
    totalCourses: 0,
    assignedLecturers: 0,
    activeUsers: 0
  });
  const [realStats, setRealStats] = useState({
    totalCourses: 0,
    assignedLecturers: 0,
    activeUsers: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8086/api/v1';

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/get_users`);
      
      if (response.ok) {
        const users = await response.json();
        const activeUserCount = users.filter(user => user.status === 'ACTIVE').length;
        
        setRealStats({
          totalCourses: 15, // This would come from a courses API endpoint
          assignedLecturers: users.filter(user => user.role === 'LECTURER' && user.status === 'ACTIVE').length,
          activeUsers: activeUserCount
        });
      } else {
        setRealStats({
          totalCourses: 0,
          assignedLecturers: 0,
          activeUsers: 0
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setRealStats({
        totalCourses: 0,
        assignedLecturers: 0,
        activeUsers: 0
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch available lecturers on component mount
  useEffect(() => {
    fetchAvailableLecturers();
    fetchStats();
  }, []);

  // Animated stats effect
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

  const fetchAvailableLecturers = async () => {
    try {
      setLoadingLecturers(true);
      const response = await fetch(`${API_BASE_URL}/admin/available_lecturers`);
      const data = await response.json();
      setAvailableLecturers(data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      setError('Failed to load available lecturers');
    } finally {
      setLoadingLecturers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Course name is required';
    if (!formData.credits || formData.credits < 1) return 'Credits must be a positive number';
    if (!formData.year || formData.year < 1) return 'Year must be a positive number';
    if (!formData.semester || formData.semester < 1 || formData.semester > 2) return 'Semester must be 1 or 2';
    if (!formData.lecturerId) return 'Please select a lecturer';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const courseData = {
        name: formData.name.trim(),
        credits: parseInt(formData.credits),
        year: parseInt(formData.year),
        semester: parseInt(formData.semester),
        lecturer_id: parseInt(formData.lecturerId)
      };

      const response = await fetch(`${API_BASE_URL}/admin/create_course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to create course');
      }

      const result = await response.json();
      
      setSuccess('Course created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        credits: '',
        year: '',
        semester: '',
        lecturerId: ''
      });

      // Refresh available lecturers and stats
      fetchAvailableLecturers();
      fetchStats();

      // Clear success message after delay
      setTimeout(() => {
        setSuccess('');
      }, 5000);

    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-3xl border border-[#01C38D]/30 shadow-lg shadow-[#01C38D]/10">
                <BookOpen className="text-[#01C38D]" size={32} />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#01C38D] to-white bg-clip-text text-transparent animate-pulse">
                  Course Management
                </h1>
                <p className="text-[#696E79] text-lg mt-2">Create and manage courses with lecturer assignments</p>
              </div>
            </div>
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
                    animatedStats.totalCourses.toLocaleString()
                  )}
                </div>
                <div className="text-[#696E79] font-medium">Total Courses</div>
                {!statsLoading && (
                  <div className="text-xs text-[#01C38D] mt-1 opacity-75">
                    Active courses
                  </div>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl">
                <BookOpen className="text-[#01C38D]" size={32} />
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
                    animatedStats.assignedLecturers.toLocaleString()
                  )}
                </div>
                <div className="text-[#696E79] font-medium">Available Lecturers</div>
                {!statsLoading && (
                  <div className="text-xs text-[#01C38D] mt-1 opacity-75">
                    Ready for assignment
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
                    animatedStats.activeUsers.toLocaleString()
                  )}
                </div>
                <div className="text-[#696E79] font-medium">Active Users</div>
                {!statsLoading && (
                  <div className="text-xs text-[#01C38D] mt-1 opacity-75">
                    Students & Lecturers
                  </div>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-2xl">
                <Users className="text-[#01C38D]" size={32} />
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
                <span className="text-[#01C38D] font-medium">Course Creation</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Create New Course
              </h2>
              <p className="text-[#696E79] text-lg max-w-2xl mx-auto">
                Add a new course with lecturer assignment and automatic enrollment management
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-5 duration-300">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-green-400 font-medium">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-5 duration-300">
                <AlertCircle className="text-red-400" size={20} />
                <span className="text-red-400 font-medium">{error}</span>
              </div>
            )}
            
            {/* Form Section */}
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                
                {/* Course Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Course Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter course name"
                      className="w-full px-6 py-4 bg-[#191E29]/70 border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:bg-[#191E29] transition-all duration-300 focus:shadow-lg focus:shadow-[#01C38D]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Credits
                    </label>
                    <input
                      type="number"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      placeholder="Enter credits"
                      min="1"
                      className="w-full px-6 py-4 bg-[#191E29]/70 border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:bg-[#191E29] transition-all duration-300 focus:shadow-lg focus:shadow-[#01C38D]/20"
                    />
                  </div>
                </div>

                {/* Year and Semester */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Academic Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="Enter year (e.g., 1, 2, 3, 4)"
                      min="1"
                      max="5"
                      className="w-full px-6 py-4 bg-[#191E29]/70 border border-[#696E79]/30 rounded-2xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:bg-[#191E29] transition-all duration-300 focus:shadow-lg focus:shadow-[#01C38D]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-[#191E29]/70 border border-[#696E79]/30 rounded-2xl text-white focus:outline-none focus:border-[#01C38D] focus:bg-[#191E29] transition-all duration-300 focus:shadow-lg focus:shadow-[#01C38D]/20"
                    >
                      <option value="">Select Semester</option>
                      <option value="1">1st Semester</option>
                      <option value="2">2nd Semester</option>
                    </select>
                  </div>
                </div>

                {/* Lecturer Assignment */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Assign Lecturer
                  </label>
                  {loadingLecturers ? (
                    <div className="w-full px-6 py-4 bg-[#191E29]/70 border border-[#696E79]/30 rounded-2xl text-[#696E79] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#01C38D]"></div>
                      <span className="ml-3">Loading lecturers...</span>
                    </div>
                  ) : (
                    <select
                      name="lecturerId"
                      value={formData.lecturerId}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-[#191E29]/70 border border-[#696E79]/30 rounded-2xl text-white focus:outline-none focus:border-[#01C38D] focus:bg-[#191E29] transition-all duration-300 focus:shadow-lg focus:shadow-[#01C38D]/20"
                    >
                      <option value="">Select a lecturer</option>
                      {availableLecturers.map((lecturer) => (
                        <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                          {lecturer.fName}
                        </option>
                      ))}
                    </select>
                  )}
                  {!loadingLecturers && availableLecturers.length === 0 && (
                    <p className="text-sm text-[#696E79] mt-2">No available lecturers found. All lecturers are already assigned to courses.</p>
                  )}
                </div>

                {/* Available Lecturers Info */}
                {!loadingLecturers && availableLecturers.length > 0 && (
                  <div className="p-4 bg-[#01C38D]/10 rounded-2xl border border-[#01C38D]/20">
                    <div className="flex items-center space-x-3">
                      <User className="text-[#01C38D]" size={20} />
                      <div>
                        <span className="text-[#01C38D] font-medium">
                          {availableLecturers.length} available lecturer{availableLecturers.length !== 1 ? 's' : ''}
                        </span>
                        <p className="text-sm text-[#696E79]">Lecturers not assigned to any course</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-8">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || loadingLecturers}
                    className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 hover:from-[#01C38D]/90 hover:to-[#01C38D]/70 text-white rounded-2xl transition-all duration-500 shadow-lg shadow-[#01C38D]/20 hover:shadow-[#01C38D]/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span className="font-medium">Creating Course...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span className="font-medium">Create Course</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-[#01C38D]/10 rounded-full border border-[#01C38D]/20 mb-8">
                <Sparkles className="text-[#01C38D]" size={20} />
                <span className="text-[#01C38D] font-medium">Course Features</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="text-[#01C38D]" size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Course Management</h4>
                  <p className="text-[#696E79] text-sm">Comprehensive course creation and content management system</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-[#01C38D]" size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Lecturer Assignment</h4>
                  <p className="text-[#696E79] text-sm">Automatic lecturer-course mapping and relationship management</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-[#132D46]/40 to-[#191E29]/20 rounded-2xl border border-[#01C38D]/10 hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="text-[#01C38D]" size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Credit System</h4>
                  <p className="text-[#696E79] text-sm">Integrated credit tracking and academic requirement management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#01C38D]/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default CreateCourse;
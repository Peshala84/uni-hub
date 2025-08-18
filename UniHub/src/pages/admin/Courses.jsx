import React, { useState, useEffect } from 'react';
import { BookOpen, User, Save, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    name: '',
    credits: '',
    year: '',
    semester: '',
    lecturer_id: '' // Changed to match backend expectation
  });
  
  const [availableLecturers, setAvailableLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'http://localhost:8086/api/v1';

  useEffect(() => {
    fetchAvailableLecturers();
  }, []);

  const fetchAvailableLecturers = async () => {
    try {
      setLoadingLecturers(true);
      const response = await fetch(`${API_BASE_URL}/admin/available_lecturers`);
      if (response.ok) {
        const data = await response.json();
        console.log('Available lecturers data:', data);
        setAvailableLecturers(data);
      } else {
        const errorText = await response.text();
        setError(`Failed to load available lecturers: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      setError('Failed to load available lecturers');
    } finally {
      setLoadingLecturers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Course name is required';
    if (!formData.credits || parseInt(formData.credits) < 1) return 'Credits must be a positive number';
    if (!formData.year || parseInt(formData.year) < 1 || parseInt(formData.year) > 5) return 'Year must be between 1 and 5';
    if (!formData.semester || parseInt(formData.semester) < 1 || parseInt(formData.semester) > 2) return 'Semester must be 1 or 2';
    if (!formData.lecturer_id) return 'Please select a lecturer';
    return null;
  };

  const handleSubmit = async () => {
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare course data to match backend DTO expectations
      const courseData = {
        name: formData.name.trim(),
        credits: parseInt(formData.credits),
        year: parseInt(formData.year),
        semester: parseInt(formData.semester),
        lecturer_id: formData.lecturer_id ? parseInt(formData.lecturer_id) : null // Match backend property name
      };

      console.log('Sending course data:', courseData);

      // Additional validation for lecturer_id
      if (!courseData.lecturer_id || isNaN(courseData.lecturer_id)) {
        setError('Please select a valid lecturer');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/create_course`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      const responseData = await response.text();
      
      if (!response.ok) {
        throw new Error(responseData || `Failed to create course (${response.status})`);
      }

      // Try to parse as JSON, fallback to text
      let result;
      try {
        result = JSON.parse(responseData);
      } catch {
        result = { message: responseData };
      }

      console.log('Course created successfully:', result);
      setSuccess('Course created and lecturer assigned successfully!');
      
      // Reset form
      setFormData({ 
        name: '', 
        credits: '', 
        year: '', 
        semester: '', 
        lecturer_id: '' 
      });
      
      // Refresh available lecturers list
      fetchAvailableLecturers();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);

    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
              <BookOpen className="text-emerald-400" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Course Management</h1>
              <p className="text-slate-400">Create and assign courses to lecturers</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
              <Sparkles className="text-emerald-400" size={16} />
              <span className="text-emerald-400 font-medium">Course Creation</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Create New Course</h2>
            <p className="text-slate-400">Add a new course with lecturer assignment</p>
          </div>

          {/* Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-green-400">{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400">{error}</span>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Course Name & Credits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Course Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter course name"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Credits <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  placeholder="Enter credits (1-6)"
                  min="1"
                  max="6"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Year & Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Academic Year <span className="text-red-400">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Semester <span className="text-red-400">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                </select>
              </div>
            </div>

            {/* Lecturer Assignment */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Assign Lecturer <span className="text-red-400">*</span>
              </label>
              {loadingLecturers ? (
                <div className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-400 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400 mr-2"></div>
                  Loading lecturers...
                </div>
              ) : (
                <>
                  <select
                    name="lecturer_id"
                    value={formData.lecturer_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    required
                  >
                    <option value="">Select a lecturer</option>
                    {availableLecturers.map((lecturer) => {
                      // Based on your backend DAO, the response should have lecturerId and fName
                      const lecturerId = lecturer.lecturerId;
                      const lecturerName = lecturer.fName; // This contains the full name from backend
                      
                      return (
                        <option key={lecturerId} value={lecturerId}>
                          {lecturerName}
                        </option>
                      );
                    })}
                  </select>
                  
                  {availableLecturers.length === 0 ? (
                    <div className="mt-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="text-amber-400" size={16} />
                        <span className="text-amber-400 text-sm">
                          No available lecturers. All are assigned to courses.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center space-x-2">
                        <User className="text-emerald-400" size={16} />
                        <span className="text-emerald-400 text-sm font-medium">
                          {availableLecturers.length} available lecturer{availableLecturers.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || loadingLecturers || availableLecturers.length === 0}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Course...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Create Course & Assign Lecturer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Debug Section - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <h3 className="text-white font-medium mb-2">Debug Info:</h3>
            <pre className="text-xs text-slate-400 overflow-auto">
              {JSON.stringify({ 
                formData, 
                availableLecturersCount: availableLecturers.length,
                firstLecturer: availableLecturers[0] || null
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
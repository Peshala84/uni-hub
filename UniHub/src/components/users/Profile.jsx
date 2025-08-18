import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, Edit3, Save, X, Camera, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';
import axios from 'axios';

const Profile = () => {
  const { userData, userRole, userId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [lecturerDetails, setLecturerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch lecturer details from backend
  const fetchLecturerDetails = async (lecturerId) => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:8086/api/v1/lecturers/${lecturerId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setLecturerDetails(response.data);
    } catch (err) {
      console.error('Error fetching lecturer details:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Failed to load lecturer details: ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Failed to load lecturer details: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Failed to load lecturer details: Request setup error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch lecturer details when component mounts and user is a lecturer
  useEffect(() => {
    if (userRole === 'lecturer' && userId) {
      fetchLecturerDetails(userId);
    }
  }, [userRole, userId]);

  // Initialize form data based on user role
  const getInitialFormData = () => {
    if (userRole === 'lecturer' && lecturerDetails) {
      return {
        name: `${lecturerDetails.f_name} ${lecturerDetails.l_name}`,
        firstName: lecturerDetails.f_name || '',
        lastName: lecturerDetails.l_name || '',
        email: lecturerDetails.email || '',
        phone: lecturerDetails.contact || '',
        nic: lecturerDetails.NIC || '',
        address: lecturerDetails.address || '',
        dob: lecturerDetails.DOB || '',
        status: lecturerDetails.status || '',
        department: userData?.department || 'Computer Science',
        office: userData?.office || '',
        bio: userData?.bio || 'Dr. Sarah Johnson is a dedicated educator with over 10 years of experience in Computer Science. She specializes in algorithms, data structures, and software engineering. Her research interests include machine learning applications in education and computational complexity theory.',
        qualifications: userData?.qualifications || [
          'Ph.D. in Computer Science - Stanford University (2012)',
          'M.S. in Computer Science - MIT (2008)',
          'B.S. in Computer Science - UC Berkeley (2006)'
        ],
        expertise: userData?.expertise || ['Algorithms & Data Structures', 'Software Engineering', 'Machine Learning', 'Database Systems']
      };
    }

    // Default for lecturer without details yet
    return {
      name: userData?.name || '',
      email: userData?.email || '',
      department: userData?.department || '',
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());

  // Update form data when lecturer details are fetched
  useEffect(() => {
    if (userRole === 'lecturer' && lecturerDetails) {
      setFormData(getInitialFormData());
    }
  }, [lecturerDetails, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(getInitialFormData());
    setIsEditing(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading lecturer details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4 text-red-500">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <p className="mb-4 text-red-600">{error}</p>
            <button
              onClick={() => fetchLecturerDetails(userId)}
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only show profile for lecturers
  if (userRole !== 'lecturer') {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Profile access is only available for lecturers.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Faculty Profile</h2>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                  <User className="w-16 h-16 text-white" />
                </div>
                {isEditing && (
                  <button className="absolute p-2 transition-colors bg-white border border-gray-200 rounded-full shadow-md -bottom-2 -right-2 hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mb-2 text-xl font-bold text-center text-gray-800 border border-gray-300 rounded-lg"
                />
              ) : (
                <h3 className="mb-2 text-xl font-bold text-gray-800">{formData.name}</h3>
              )}

              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-center text-gray-600 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-600">{formData.department}</p>
              )}
            </div>

            <div className="pt-6 mt-6 space-y-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                ) : (
                  <span className="text-sm text-gray-700">{formData.email}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="Phone number"
                  />
                ) : (
                  <span className="text-sm text-gray-700">{formData.phone || 'Not provided'}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    name="office"
                    value={formData.office || ''}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="Office location"
                  />
                ) : (
                  <span className="text-sm text-gray-700">{formData.office || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Biography */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h4 className="mb-4 text-lg font-semibold text-gray-800">Biography</h4>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 leading-relaxed text-gray-700 border border-gray-300 rounded-lg"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="leading-relaxed text-gray-700">{formData.bio || 'No biography available'}</p>
            )}
          </div>

          {/* Personal Information */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h4 className="mb-4 text-lg font-semibold text-gray-800">Personal Information</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <p className="font-medium text-gray-700">{`${lecturerDetails?.f_name || ''} ${lecturerDetails?.l_name || ''}`.trim() || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                <p className="font-medium text-gray-700">{lecturerDetails?.f_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                <p className="font-medium text-gray-700">{lecturerDetails?.l_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                <p className="text-gray-700">{lecturerDetails?.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-700">{lecturerDetails?.contact || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Contact</label>
                <p className="text-gray-700">{lecturerDetails?.contact || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">NIC</label>
                <p className="font-mono text-gray-700">{lecturerDetails?.NIC || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-700">{lecturerDetails?.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="text-gray-700">{lecturerDetails?.DOB || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                <p className="font-medium text-gray-700">{lecturerDetails?.role || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h4 className="mb-4 text-lg font-semibold text-gray-800">Education & Qualifications</h4>
            <div className="space-y-3">
              {(formData.qualifications || []).map((qualification, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">{qualification}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h4 className="mb-4 text-lg font-semibold text-gray-800">Areas of Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {(formData.expertise || []).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';

const Profile = () => {
  const { userData, userRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form data based on user role
  const getInitialFormData = () => {
    const baseData = {
      name: userData?.name || '',
      email: userData?.email || '',
      department: userData?.department || '',
    };

    if (userRole === 'lecturer') {
      return {
        ...baseData,
        phone: userData?.phone || '',
        office: userData?.office || '',
        bio: userData?.bio || 'Dr. Sarah Johnson is a dedicated educator with over 10 years of experience in Computer Science. She specializes in algorithms, data structures, and software engineering. Her research interests include machine learning applications in education and computational complexity theory.',
        qualifications: userData?.qualifications || [
          'Ph.D. in Computer Science - Stanford University (2012)',
          'M.S. in Computer Science - MIT (2008)',
          'B.S. in Computer Science - UC Berkeley (2006)'
        ],
        expertise: userData?.expertise || ['Algorithms & Data Structures', 'Software Engineering', 'Machine Learning', 'Database Systems']
      };
    } else if (userRole === 'student') {
      return {
        ...baseData,
        studentId: userData?.studentId || '',
        year: userData?.year || '',
        gpa: userData?.gpa || '3.85',
        phone: userData?.phone || '',
        address: userData?.address || '',
        emergencyContact: userData?.emergencyContact || '',
        courses: userData?.courses || ['Data Structures', 'Database Systems', 'Software Engineering', 'Machine Learning', 'Web Development', 'Computer Networks']
      };
    }

    return baseData;
  };

  const [formData, setFormData] = useState(getInitialFormData());

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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {userRole === 'student' ? 'Student Profile' : 
             userRole === 'lecturer' ? 'Faculty Profile' : 'Profile Information'}
          </h2>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-16 w-16 text-white" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-xl font-bold text-gray-800 text-center w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-800 mb-2">{formData.name}</h3>
              )}
              
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="text-gray-600 text-center w-full border border-gray-300 rounded-lg px-3 py-1"
                />
              ) : (
                <p className="text-gray-600">{formData.department}</p>
              )}
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <span className="text-gray-700 text-sm">{formData.email}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Phone number"
                  />
                ) : (
                  <span className="text-gray-700 text-sm">{formData.phone || 'Not provided'}</span>
                )}
              </div>
              
              {/* Role-specific fields */}
              {userRole === 'lecturer' && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="office"
                      value={formData.office || ''}
                      onChange={handleInputChange}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Office location"
                    />
                  ) : (
                    <span className="text-gray-700 text-sm">{formData.office || 'Not provided'}</span>
                  )}
                </div>
              )}

              {userRole === 'student' && (
                <>
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId || ''}
                        onChange={handleInputChange}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Student ID"
                      />
                    ) : (
                      <span className="text-gray-700 text-sm">ID: {formData.studentId || 'Not provided'}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="year"
                        value={formData.year || ''}
                        onChange={handleInputChange}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Academic year"
                      />
                    ) : (
                      <span className="text-gray-700 text-sm">{formData.year || 'Not provided'}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography / Academic Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {userRole === 'student' ? 'Academic Information' : 'Biography'}
            </h4>
            {userRole === 'student' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="gpa"
                      value={formData.gpa || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="GPA"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg font-semibold">{formData.gpa || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Emergency contact"
                    />
                  ) : (
                    <p className="text-gray-700">{formData.emergencyContact || 'Not provided'}</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 leading-relaxed"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{formData.bio || 'No biography available'}</p>
                )}
              </>
            )}
          </div>

          {/* Role-specific sections */}
          {userRole === 'lecturer' && (
            <>
              {/* Qualifications */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Education & Qualifications</h4>
                <div className="space-y-3">
                  {(formData.qualifications || []).map((qualification, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{qualification}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Areas of Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {(formData.expertise || []).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {userRole === 'student' && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Enrolled Courses</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(formData.courses || []).map((course, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
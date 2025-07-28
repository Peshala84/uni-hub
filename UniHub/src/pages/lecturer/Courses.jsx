import React, { useState } from 'react';
import { BookOpen, Plus, MessageSquare, Star, FileText, BookMarked, Users, HelpCircle } from 'lucide-react';
import Queries from '../../components/users/Queries';
import { useAuth } from '../../contexts/AuthContexts';
import axios from 'axios';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showForm, setShowForm] = useState(false);
  const { userData } = useAuth();

  // Debug log to check userData
  console.log('Current userData:', userData);

  // Form states for announcement
  const [announcementForm, setAnnouncementForm] = useState({
    course_id: '',
    content: '',
    link: '',
    attachment: null // Will store the actual file object
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleAnnouncementInputChange = (field, value) => {
    setAnnouncementForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (images and PDFs only)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        setAnnouncementForm(prev => ({
          ...prev,
          attachment: file
        }));
      } else {
        setSubmitMessage({ type: 'error', text: 'Please select only image files (JPEG, PNG, GIF) or PDF files.' });
        e.target.value = ''; // Clear the file input
      }
    }
  };

  const handleAnnouncementSubmit = async () => {
    if (!announcementForm.course_id || !announcementForm.content) {
      setSubmitMessage({ type: 'error', text: 'Please fill in required fields (Course ID and Content).' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;
      formData.append("lecturerId", lecturerId);
      formData.append("courseId", announcementForm.course_id);
      formData.append("content", announcementForm.content);
      
      if (announcementForm.link) {
        formData.append('link', announcementForm.link);
      }

      if (announcementForm.attachment) {
        formData.append('attachment', announcementForm.attachment);
      }

      console.log('Sending announcement data:', {
        lecturer_id: lecturerId,
        course_id: announcementForm.course_id,
        content: announcementForm.content,
        link: announcementForm.link,
        attachment: announcementForm.attachment ? announcementForm.attachment.name : null
      });

      const response = await axios.post("http://localhost:8086/api/v1/lecturer/announcement", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log('Response status:', response.status);
      console.log('Success response:', response.data);

      setSubmitMessage({ type: 'success', text: 'Announcement published successfully!' });

      // Reset form
      setAnnouncementForm({
        course_id: '',
        content: '',
        link: '',
        attachment: null
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      // Hide form after successful submission
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      console.error('Error publishing announcement:', error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        setSubmitMessage({
          type: 'error',
          text: error.response.data?.message || error.response.data || 'Failed to publish announcement'
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network error:', error.request);
        setSubmitMessage({
          type: 'error',
          text: 'Cannot connect to server. Please ensure the backend is running on port 8086.'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
        setSubmitMessage({
          type: 'error',
          text: 'An error occurred while setting up the request.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: MessageSquare, color: 'text-green-600' },
    { id: 'assignments', label: 'Assignments', icon: FileText, color: 'text-green-600' },
    { id: 'resources', label: 'Learning Resources', icon: BookMarked, color: 'text-green-600' },
    { id: 'queries', label: 'Student Queries', icon: HelpCircle, color: 'text-orange-600' },
    { id: 'feedback', label: 'Feedback', icon: Star, color: 'text-yellow-600' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'announcements':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Course Announcements</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Announcement</span>
              </button>
            </div>

            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Create New Announcement</h4>

                {submitMessage.text && (
                  <div className={`mb-4 p-3 rounded-lg ${submitMessage.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {submitMessage.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Course ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={announcementForm.course_id}
                      onChange={(e) => handleAnnouncementInputChange('course_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter course ID (e.g., CS301, MATH201)"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={announcementForm.content}
                      onChange={(e) => handleAnnouncementInputChange('content', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter announcement content"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Link (Optional)</label>
                    <input
                      type="url"
                      value={announcementForm.link}
                      onChange={(e) => handleAnnouncementInputChange('link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="https://example.com/resource"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Attachment (Optional)</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        name="attachment"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-gray-500">
                        Supported formats: PDF, JPEG, PNG, GIF (Max size: 10MB)
                      </p>
                      {announcementForm.attachment && (
                        <div className="flex items-center p-2 space-x-2 rounded-lg bg-green-50">
                          <span className="text-sm text-green-700">
                            📎 {announcementForm.attachment.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAnnouncementForm(prev => ({ ...prev, attachment: null }));
                              const fileInput = document.querySelector('input[type="file"]');
                              if (fileInput) fileInput.value = '';
                            }}
                            className="text-red-500 hover:text-red-700"
                            disabled={isSubmitting}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAnnouncementSubmit}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish'}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setAnnouncementForm({ course_id: '', content: '', link: '', attachment: null });
                        setSubmitMessage({ type: '', text: '' });
                        // Clear file input
                        const fileInput = document.querySelector('input[type="file"]');
                        if (fileInput) fileInput.value = '';
                      }}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-800">Week {item} Assignment Due</h4>
                  <p className="mb-2 text-sm text-gray-600">Complete the programming exercises for Chapter {item}.</p>
                  <span className="text-xs text-gray-500">Posted 2 days ago</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Assignments</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Assignment</span>
              </button>
            </div>

            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Create New Assignment</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Assignment Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter assignment title"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter assignment instructions"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
                      Create Assignment
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-800">Assignment {item}</h4>
                  <p className="mb-3 text-sm text-gray-600">Due: Jan {15 + item}, 2024</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                      {item % 2 === 0 ? 'Active' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-500">{20 - item * 2} submissions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Learning Resources</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Resource</span>
              </button>
            </div>

            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Add Learning Resource</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Resource Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter resource title"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option>PDF Document</option>
                        <option>Video Lecture</option>
                        <option>External Link</option>
                        <option>Presentation</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter resource description"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
                      Add Resource
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { title: 'Algorithm Analysis Notes', type: 'PDF', size: '2.5 MB' },
                { title: 'Data Structures Video Series', type: 'Video', duration: '45 min' },
                { title: 'Programming Best Practices', type: 'Link', domain: 'external' },
                { title: 'Midterm Study Guide', type: 'PDF', size: '1.8 MB' }
              ].map((resource, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-800">{resource.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                      {resource.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {resource.size || resource.duration || resource.domain}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'queries':
        return <Queries />;

      case 'feedback':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Student Feedback</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { rating: 4.5, comment: 'Great explanation of complex topics', student: 'Anonymous', course: 'CS301' },
                { rating: 5.0, comment: 'Very helpful office hours', student: 'Student A', course: 'CS202' },
                { rating: 4.2, comment: 'Assignments are challenging but fair', student: 'Anonymous', course: 'CS301' }
              ].map((feedback, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(feedback.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {feedback.rating}
                      </span>
                    </div>
                    <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
                      {feedback.course}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">"{feedback.comment}"</p>
                  <p className="text-xs text-gray-500">- {feedback.student}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!userData && (
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-4 mb-4 text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-lg">
            <p>⚠️ User not logged in. Using default lecturer ID for development.</p>
          </div>
        </div>
      )}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4 space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          </div>
          <p className="text-gray-600">
            Manage your courses, assignments, and interact with students efficiently.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowForm(false);
                    setAnnouncementForm({ course_id: '', content: '', link: '', attachment: null });
                    setSubmitMessage({ type: '', text: '' });
                    // Clear file input
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = '';
                  }}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                    ? `border-green-500 ${tab.color} bg-blue-50`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Courses;
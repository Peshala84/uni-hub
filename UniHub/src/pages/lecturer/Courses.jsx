import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, MessageSquare, Star, FileText, BookMarked, Users, HelpCircle } from 'lucide-react';
import Queries from '../../components/users/Queries';
import { useAuth } from '../../contexts/AuthContexts';
import axios from 'axios';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showForm, setShowForm] = useState(false);
  const { userData } = useAuth();


  // Feedback state
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
  const [announcementError, setAnnouncementError] = useState('');

  // Assignments state
  const [assignments, setAssignments] = useState([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [assignmentError, setAssignmentError] = useState('');

  // Resources state
  const [resources, setResources] = useState([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [resourceError, setResourceError] = useState('');

  // Debug log to check userData
  console.log('Current userData:', userData);

  // Form states for announcement
  const [announcementForm, setAnnouncementForm] = useState({
    course_id: '',
    content: '',
    link: '',
    attachment: null // Will store the actual file object
  });


  // Form states for assignment
  const [assignmentForm, setAssignmentForm] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: '',
    attachment: null // Will store the actual file object
  });

  // Form states for resource
  const [resourceForm, setResourceForm] = useState({
    course_id: '',
    file_name: '',
    attachment: null // Will store the actual file object
  });



  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Function to fetch feedback data
  const fetchFeedback = async () => {
    setIsLoadingFeedback(true);
    setFeedbackError('');

    try {
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;

      console.log('Fetching feedback for lecturer ID:', lecturerId);

      const response = await axios.get(`http://localhost:8086/api/v1/lecturer/${lecturerId}/feedback`);

      console.log('Feedback response:', response.data);
      setFeedbacks(response.data);

    } catch (error) {
      console.error('Error fetching feedback:', error);

      if (error.response) {
        setFeedbackError(error.response.data?.message || 'Failed to fetch feedback');
      } else if (error.request) {
        setFeedbackError('Cannot connect to server. Please ensure the backend is running on port 8086.');
      } else {
        setFeedbackError('An error occurred while fetching feedback.');
      }
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // Function to fetch announcements data
  const fetchAnnouncements = async () => {
    setIsLoadingAnnouncements(true);
    setAnnouncementError('');

    try {
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;

      console.log('Fetching announcements for lecturer ID:', lecturerId);

      const response = await axios.get(`http://localhost:8086/api/v1/lecturer/${lecturerId}/announcements`);

      console.log('Announcements response:', response.data);
      setAnnouncements(response.data);

    } catch (error) {
      console.error('Error fetching announcements:', error);

      if (error.response) {
        setAnnouncementError(error.response.data?.message || 'Failed to fetch announcements');
      } else if (error.request) {
        setAnnouncementError('Cannot connect to server. Please ensure the backend is running on port 8086.');
      } else {
        setAnnouncementError('An error occurred while fetching announcements.');
      }
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  // Function to fetch assignments data
  const fetchAssignments = async () => {
    setIsLoadingAssignments(true);
    setAssignmentError('');

    try {
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;

      console.log('Fetching assignments for lecturer ID:', lecturerId);

      const response = await axios.get(`http://localhost:8086/api/v1/lecturer/${lecturerId}/assignments`);

      console.log('Assignments response:', response.data);
      setAssignments(response.data);

    } catch (error) {
      console.error('Error fetching assignments:', error);

      if (error.response) {
        setAssignmentError(error.response.data?.message || 'Failed to fetch assignments');
      } else if (error.request) {
        setAssignmentError('Cannot connect to server. Please ensure the backend is running on port 8086.');
      } else {
        setAssignmentError('An error occurred while fetching assignments.');
      }
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  // Function to fetch resources data
  const fetchResources = async () => {
    setIsLoadingResources(true);
    setResourceError('');

    try {
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;

      console.log('Fetching resources for lecturer ID:', lecturerId);

      const response = await axios.get(`http://localhost:8086/api/v1/lecturer/${lecturerId}/resources`);

      console.log('Resources response:', response.data);
      setResources(response.data);

    } catch (error) {
      console.error('Error fetching resources:', error);

      if (error.response) {
        setResourceError(error.response.data?.message || 'Failed to fetch resources');
      } else if (error.request) {
        setResourceError('Cannot connect to server. Please ensure the backend is running on port 8086.');
      } else {
        setResourceError('An error occurred while fetching resources.');
      }
    } finally {
      setIsLoadingResources(false);
    }
  };

  // Fetch feedback when component mounts or when activeTab changes to feedback
  useEffect(() => {
    if (activeTab === 'feedback') {
      fetchFeedback();
    }
  }, [activeTab, userData]);

  // Fetch announcements when component mounts or when activeTab changes to announcements
  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [activeTab, userData]);


  // Fetch assignments when component mounts or when activeTab changes to assignments
  useEffect(() => {
    if (activeTab === 'assignments') {
      fetchAssignments();
    }
  }, [activeTab, userData]);

  // Fetch resources when component mounts or when activeTab changes to resources
  useEffect(() => {
    if (activeTab === 'resources') {
      fetchResources();
    }
  }, [activeTab, userData]);


  const handleAnnouncementInputChange = (field, value) => {
    setAnnouncementForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleAssignmentInputChange = (field, value) => {
    setAssignmentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResourceInputChange = (field, value) => {
    setResourceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const formType = e.target.getAttribute('data-form-type'); // To distinguish between announcement, assignment, and resource forms


    if (file) {
      // Check file type (images and PDFs only)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {

        if (formType === 'assignment') {
          setAssignmentForm(prev => ({
            ...prev,
            attachment: file
          }));
        } else if (formType === 'resource') {
          setResourceForm(prev => ({
            ...prev,
            attachment: file
          }));
        } else {
          setAnnouncementForm(prev => ({
            ...prev,
            attachment: file
          }));
        }

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


      // Refresh announcements list
      fetchAnnouncements();


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




  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;

      console.log('Deleting announcement:', announcementId);

      const response = await axios.delete(
        `http://localhost:8086/api/v1/lecturer/${lecturerId}/announcement/${announcementId}`
      );

      console.log('Delete response status:', response.status);

      setSubmitMessage({ type: 'success', text: 'Announcement deleted successfully!' });

      // Refresh announcements list
      fetchAnnouncements();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error('Error deleting announcement:', error);

      if (error.response) {
        console.error('Error response:', error.response.data);
        setSubmitMessage({
          type: 'error',
          text: error.response.data?.message || error.response.data || 'Failed to delete announcement'
        });
      } else if (error.request) {
        console.error('Network error:', error.request);
        setSubmitMessage({
          type: 'error',
          text: 'Cannot connect to server. Please ensure the backend is running on port 8086.'
        });
      } else {
        console.error('Request error:', error.message);
        setSubmitMessage({
          type: 'error',
          text: 'An error occurred while deleting the announcement.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;

      console.log('Deleting assignment:', assignmentId);

      const response = await axios.delete(
        `http://localhost:8086/api/v1/lecturer/${lecturerId}/assignment/${assignmentId}`
      );

      console.log('Delete response status:', response.status);

      setSubmitMessage({ type: 'success', text: 'Assignment deleted successfully!' });

      // Refresh assignments list
      fetchAssignments();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error('Error deleting assignment:', error);

      if (error.response) {
        console.error('Error response:', error.response.data);
        setSubmitMessage({
          type: 'error',
          text: error.response.data?.message || error.response.data || 'Failed to delete assignment'
        });
      } else if (error.request) {
        console.error('Network error:', error.request);
        setSubmitMessage({
          type: 'error',
          text: 'Cannot connect to server. Please ensure the backend is running on port 8086.'
        });
      } else {
        console.error('Request error:', error.message);
        setSubmitMessage({
          type: 'error',
          text: 'An error occurred while deleting the assignment.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const lecturerId = userData?.id || 1;

      console.log('Deleting resource:', resourceId);

      const response = await axios.delete(
        `http://localhost:8086/api/v1/lecturer/${lecturerId}/resource/${resourceId}`
      );

      console.log('Delete response status:', response.status);

      setSubmitMessage({ type: 'success', text: 'Resource deleted successfully!' });

      // Refresh resources list
      fetchResources();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error('Error deleting resource:', error);

      if (error.response) {
        console.error('Error response:', error.response.data);
        setSubmitMessage({
          type: 'error',
          text: error.response.data?.message || error.response.data || 'Failed to delete resource'
        });
      } else if (error.request) {
        console.error('Network error:', error.request);
        setSubmitMessage({
          type: 'error',
          text: 'Cannot connect to server. Please ensure the backend is running on port 8086.'
        });
      } else {
        console.error('Request error:', error.message);
        setSubmitMessage({
          type: 'error',
          text: 'An error occurred while deleting the resource.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleAssignmentSubmit = async () => {
    if (!assignmentForm.course_id || !assignmentForm.title || !assignmentForm.description || !assignmentForm.due_date) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields (Course ID, Title, Description, and Due Date).' });
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
      formData.append("courseId", assignmentForm.course_id);
      formData.append("title", assignmentForm.title);
      formData.append("description", assignmentForm.description);

      // Convert date to Java-compatible format (YYYY-MM-DD)
      const dueDate = new Date(assignmentForm.due_date);
      const formattedDate = dueDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      formData.append("date", formattedDate);

      if (assignmentForm.attachment) {
        formData.append('attachment', assignmentForm.attachment);
      }

      console.log('Sending assignment data:', {
        lecturer_id: lecturerId,
        course_id: assignmentForm.course_id,
        title: assignmentForm.title,
        description: assignmentForm.description,
        date: formattedDate,
        attachment: assignmentForm.attachment ? assignmentForm.attachment.name : null
      });

      const response = await axios.post("http://localhost:8086/api/v1/lecturer/assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Response status:', response.status);
      console.log('Success response:', response.data);

      setSubmitMessage({ type: 'success', text: 'Assignment created successfully!' });

      // Reset form
      setAssignmentForm({
        course_id: '',
        title: '',
        description: '',
        due_date: '',
        attachment: null
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"][data-form-type="assignment"]');
      if (fileInput) fileInput.value = '';

      // Refresh assignments list
      fetchAssignments();

      // Hide form after successful submission
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      console.error('Error creating assignment:', error);

      if (error.response) {
        console.error('Error response:', error.response.data);
        setSubmitMessage({
          type: 'error',
          text: error.response.data?.message || error.response.data || 'Failed to create assignment'
        });
      } else if (error.request) {
        console.error('Network error:', error.request);
        setSubmitMessage({
          type: 'error',
          text: 'Cannot connect to server. Please ensure the backend is running on port 8086.'
        });
      } else {
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

  const handleResourceSubmit = async () => {
    if (!resourceForm.course_id || !resourceForm.file_name) {
      setSubmitMessage({ type: 'error', text: 'Please fill in required fields (Course ID and File Name).' });
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
      formData.append("courseId", resourceForm.course_id);
      formData.append("fileName", resourceForm.file_name);

      if (resourceForm.attachment) {
        formData.append('attachment', resourceForm.attachment);
      }

      console.log('Sending resource data:', {
        lecturer_id: lecturerId,
        course_id: resourceForm.course_id,
        file_name: resourceForm.file_name,
        attachment: resourceForm.attachment ? resourceForm.attachment.name : null
      });

      const response = await axios.post("http://localhost:8086/api/v1/lecturer/resource", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Response status:', response.status);
      console.log('Success response:', response.data);

      setSubmitMessage({ type: 'success', text: 'Resource uploaded successfully!' });

      // Reset form
      setResourceForm({
        course_id: '',
        file_name: '',
        attachment: null
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"][data-form-type="resource"]');
      if (fileInput) fileInput.value = '';

      // Refresh resources list
      fetchResources();

      // Hide form after successful submission
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      console.error('Error uploading resource:', error);

      if (error.response) {
        console.error('Error response:', error.response.data);
        setSubmitMessage({
          type: 'error',
          text: error.response.data?.message || error.response.data || 'Failed to upload resource'
        });
      } else if (error.request) {
        console.error('Network error:', error.request);
        setSubmitMessage({
          type: 'error',
          text: 'Cannot connect to server. Please ensure the backend is running on port 8086.'
        });
      } else {
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

              <div className="flex space-x-3">
                <button
                  onClick={fetchAnnouncements}
                  disabled={isLoadingAnnouncements}
                  className="flex items-center px-4 py-2 space-x-2 text-blue-600 transition-colors border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAnnouncements ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Refresh</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setSubmitMessage({ type: '', text: '' });
                  }}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Announcement</span>
                </button>
              </div>

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

                        data-form-type="announcement"

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



            {/* Error Message */}
            {announcementError && (
              <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                <p className="font-medium">Error loading announcements:</p>
                <p>{announcementError}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoadingAnnouncements && announcements.length === 0 && (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <span className="text-gray-600">Loading announcements...</span>
                </div>
              </div>
            )}

            {/* No Announcements Message */}
            {!isLoadingAnnouncements && announcements.length === 0 && !announcementError && (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="mb-2 text-lg font-medium text-gray-600">No announcements yet</h4>
                  <p className="text-gray-500">You haven't created any announcements. Click "Add Announcement" to get started.</p>
                </div>
              </div>
            )}

            {/* Announcements List */}

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.announcement_id}
                  className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2 space-x-2">
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          Course: {announcement.course_id}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {announcement.announcement_id}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="leading-relaxed text-gray-800 whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                      </div>

                      {/* Link */}
                      {announcement.link && (
                        <div className="mb-3">
                          <a
                            href={announcement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>View Link</span>
                          </a>
                        </div>
                      )}

                      {/* Attachment */}
                      {announcement.attachment && (
                        <div className="mb-3">
                          <div className="flex items-center p-2 space-x-2 border rounded-lg bg-gray-50">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-sm text-gray-700">
                              {announcement.attachment}
                            </span>
                            <button
                              onClick={() => {
                                // You can implement download functionality here
                                console.log('Download attachment:', announcement.attachment);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center ml-4 space-x-2">
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.announcement_id)}
                        disabled={isSubmitting}
                        className="p-1 text-gray-500 transition-colors hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between pt-3 text-xs text-gray-500 border-t border-gray-100">
                    <span>
                      {announcement.created_at
                        ? `Posted on ${new Date(announcement.created_at).toLocaleDateString()} at ${new Date(announcement.created_at).toLocaleTimeString()}`
                        : 'Recently posted'
                      }
                    </span>
                    <span className="px-2 py-1 text-green-800 bg-green-100 rounded-full">
                      Published
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legacy static announcements (remove these once you have real data) */}
            {announcements.length === 0 && !isLoadingAnnouncements && !announcementError && (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 bg-white border border-gray-200 rounded-lg opacity-50">
                    <div className="flex items-center mb-2 space-x-2">
                      <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                        Sample Data
                      </span>
                    </div>
                    <h4 className="mb-2 font-medium text-gray-600">Week {item} Assignment Due</h4>
                    <p className="mb-2 text-sm text-gray-500">Complete the programming exercises for Chapter {item}.</p>
                    <span className="text-xs text-gray-400">Posted 2 days ago</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Assignments</h3>
              <div className="flex space-x-3">
                <button
                  onClick={fetchAssignments}
                  disabled={isLoadingAssignments}
                  className="flex items-center px-4 py-2 space-x-2 text-blue-600 transition-colors border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAssignments ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Refresh</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setSubmitMessage({ type: '', text: '' });
                  }}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Assignment</span>
                </button>
              </div>
            </div>

            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Create New Assignment</h4>

                {submitMessage.text && (
                  <div className={`mb-4 p-3 rounded-lg ${submitMessage.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {submitMessage.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>

                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Course ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={assignmentForm.course_id}
                        onChange={(e) => handleAssignmentInputChange('course_id', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter course ID (e.g., CS301, MATH201)"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>

                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={assignmentForm.due_date}
                        onChange={(e) => handleAssignmentInputChange('due_date', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>

                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Assignment Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={assignmentForm.title}
                      onChange={(e) => handleAssignmentInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter assignment title"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Instructions/Description <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      rows={4}
                      value={assignmentForm.description}
                      onChange={(e) => handleAssignmentInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter assignment instructions and description"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Attachment (Optional)</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        name="attachment"
                        data-form-type="assignment"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        Supported formats: PDF, JPEG, PNG, GIF (Max size: 10MB)
                      </p>
                      {assignmentForm.attachment && (
                        <div className="flex items-center p-2 space-x-2 rounded-lg bg-green-50">
                          <span className="text-sm text-green-700">
                            📎 {assignmentForm.attachment.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAssignmentForm(prev => ({ ...prev, attachment: null }));
                              const fileInput = document.querySelector('input[type="file"][data-form-type="assignment"]');
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
                      onClick={handleAssignmentSubmit}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Assignment'}
                    </button>
                    <button

                      onClick={() => {
                        setShowForm(false);
                        setAssignmentForm({ course_id: '', title: '', description: '', due_date: '', attachment: null });
                        setSubmitMessage({ type: '', text: '' });
                        // Clear file input
                        const fileInput = document.querySelector('input[type="file"][data-form-type="assignment"]');
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

            {/* Error Message */}
            {assignmentError && (
              <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                <p className="font-medium">Error loading assignments:</p>
                <p>{assignmentError}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoadingAssignments && assignments.length === 0 && (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <span className="text-gray-600">Loading assignments...</span>
                </div>
              </div>
            )}

            {/* No Assignments Message */}
            {!isLoadingAssignments && assignments.length === 0 && !assignmentError && (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="mb-2 text-lg font-medium text-gray-600">No assignments yet</h4>
                  <p className="text-gray-500">You haven't created any assignments. Click "Add Assignment" to get started.</p>
                </div>
              </div>
            )}

            {/* Assignments List */}
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.assignment_id}
                  className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3 space-x-2">
                        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                          Course: {assignment.course_id}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                          ID: {assignment.assignment_id}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${new Date(assignment.date) < new Date()
                            ? 'text-red-700 bg-red-100'
                            : 'text-green-700 bg-green-100'
                          }`}>
                          Due: {new Date(assignment.date).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="mb-3 text-xl font-semibold text-gray-800">
                        {assignment.title}
                      </h4>

                      <div className="mb-4">
                        <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                          {assignment.description}
                        </p>
                      </div>

                      {/* Attachment */}
                      {assignment.attachment && (
                        <div className="mb-4">
                          <div className="flex items-center p-3 space-x-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700">
                                Attachment: {assignment.attachment}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                // You can implement download functionality here
                                console.log('Download attachment:', assignment.attachment);
                              }}
                              className="px-3 py-1 text-sm text-blue-600 transition-colors rounded hover:text-blue-800 hover:bg-blue-50"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Assignment Stats */}
                      {/* <div className="grid grid-cols-2 gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-800">
                            {Math.floor(Math.random() * 25) + 5} 
                          </div>
                          <div className="text-xs text-gray-600">Submissions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-800">
                            {Math.ceil((new Date(assignment.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(assignment.date) < new Date() ? 'Overdue' : 'Remaining'}
                          </div>
                        </div>
                      </div> */}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center ml-6 space-x-2">
                      <button
                        onClick={() => {
                          // You can implement edit functionality here
                          console.log('Edit assignment:', assignment.assignment_id);
                        }}
                        className="p-2 text-gray-500 transition-colors hover:text-blue-600"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.assignment_id)}
                        disabled={isSubmitting}
                        className="p-2 text-gray-500 transition-colors hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Timestamp */}
                  {/* <div className="flex items-center justify-between pt-4 text-xs text-gray-500 border-t border-gray-100">
                    <span>
                      {assignment.created_at 
                        ? `Created on ${new Date(assignment.created_at).toLocaleDateString()} at ${new Date(assignment.created_at).toLocaleTimeString()}`
                        : 'Recently created'
                      }
                    </span>
                    <span className="px-2 py-1 text-blue-800 bg-blue-100 rounded-full">
                      Active
                    </span>
                  </div> */}
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
              <div className="flex space-x-3">
                <button
                  onClick={fetchResources}
                  disabled={isLoadingResources}
                  className="flex items-center px-4 py-2 space-x-2 text-blue-600 transition-colors border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingResources ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Refresh</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setSubmitMessage({ type: '', text: '' });
                  }}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>
            </div>

            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Add Learning Resource</h4>

                {submitMessage.text && (
                  <div className={`mb-4 p-3 rounded-lg ${submitMessage.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {submitMessage.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>

                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Course ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={resourceForm.course_id}
                        onChange={(e) => handleResourceInputChange('course_id', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter course ID (e.g., CS301, MATH201)"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        File Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={resourceForm.file_name}
                        onChange={(e) => handleResourceInputChange('file_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter file name/title"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>

                    <label className="block mb-2 text-sm font-medium text-gray-700">Attachment (Optional)</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        name="attachment"
                        data-form-type="resource"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        Supported formats: PDF, JPEG, PNG, GIF (Max size: 10MB)
                      </p>
                      {resourceForm.attachment && (
                        <div className="flex items-center p-2 space-x-2 rounded-lg bg-green-50">
                          <span className="text-sm text-green-700">
                            📎 {resourceForm.attachment.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setResourceForm(prev => ({ ...prev, attachment: null }));
                              const fileInput = document.querySelector('input[type="file"][data-form-type="resource"]');
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
                      onClick={handleResourceSubmit}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Uploading...' : 'Upload Resource'}
                    </button>
                    <button

                      onClick={() => {
                        setShowForm(false);
                        setResourceForm({ course_id: '', file_name: '', attachment: null });
                        setSubmitMessage({ type: '', text: '' });
                        // Clear file input
                        const fileInput = document.querySelector('input[type="file"][data-form-type="resource"]');
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

            {/* Error Message */}
            {resourceError && (
              <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                <p className="font-medium">Error loading resources:</p>
                <p>{resourceError}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoadingResources && resources.length === 0 && (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <span className="text-gray-600">Loading resources...</span>
                </div>
              </div>
            )}

            {/* No Resources Message */}
            {!isLoadingResources && resources.length === 0 && !resourceError && (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <BookMarked className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="mb-2 text-lg font-medium text-gray-600">No resources yet</h4>
                  <p className="text-gray-500">You haven't uploaded any learning resources. Click "Add Resource" to get started.</p>
                </div>
              </div>
            )}

            {/* Resources List */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <div
                  key={resource.resource_id}
                  className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2 space-x-2">
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          Course: {resource.course_id}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {resource.resource_id}
                        </span>
                      </div>

                      <h4 className="mb-3 text-lg font-semibold text-gray-800">
                        {resource.file_name}
                      </h4>

                      {/* Attachment */}
                      {resource.attachment && (
                        <div className="mb-3">
                          <div className="flex items-center p-3 space-x-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700">
                                {resource.attachment}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                // You can implement download functionality here
                                console.log('Download attachment:', resource.attachment);
                              }}
                              className="px-3 py-1 text-sm text-blue-600 transition-colors rounded hover:text-blue-800 hover:bg-blue-50"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center ml-4 space-x-2">
                      <button
                        onClick={() => {
                          // You can implement edit functionality here
                          console.log('Edit resource:', resource.resource_id);
                        }}
                        className="p-1 text-gray-500 transition-colors hover:text-blue-600"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resource.resource_id)}
                        disabled={isSubmitting}
                        className="p-1 text-gray-500 transition-colors hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between pt-3 text-xs text-gray-500 border-t border-gray-100">
                    <span>
                      {resource.created_at
                        ? `Uploaded on ${new Date(resource.created_at).toLocaleDateString()} at ${new Date(resource.created_at).toLocaleTimeString()}`
                        : 'Recently uploaded'
                      }
                    </span>
                    <span className="px-2 py-1 text-green-800 bg-green-100 rounded-full">
                      Available
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

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Student Feedback</h3>
              <button
                onClick={fetchFeedback}
                disabled={isLoadingFeedback}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingFeedback ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {feedbackError && (
              <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                <p className="font-medium">Error loading feedback:</p>
                <p>{feedbackError}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoadingFeedback && feedbacks.length === 0 && (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <span className="text-gray-600">Loading feedback...</span>
                </div>
              </div>
            )}

            {/* No Feedback Message */}
            {!isLoadingFeedback && feedbacks.length === 0 && !feedbackError && (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="mb-2 text-lg font-medium text-gray-600">No feedback yet</h4>
                  <p className="text-gray-500">Students haven't submitted any feedback for your courses.</p>
                </div>
              </div>
            )}

            {/* Feedback Cards */}
            {feedbacks.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {feedbacks.map((feedback, index) => (
                  <div key={index} className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(feedback.rate || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {feedback.rate || 0}/5
                        </span>
                      </div>
                      <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                        Student ID: {feedback.student_id || 'N/A'}

                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        "{feedback.review || 'No review provided'}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Student: {feedback.student_name || `Student ${feedback.student_id}`}</span>
                      {feedback.created_at && (
                        <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback Statistics */}
            {feedbacks.length > 0 && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="mb-3 text-lg font-medium text-gray-800">Feedback Summary</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {feedbacks.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Feedback</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {feedbacks.length > 0
                        ? (feedbacks.reduce((sum, f) => sum + (f.rate || 0), 0) / feedbacks.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {feedbacks.filter(f => (f.rate || 0) >= 4).length}
                    </div>
                    <div className="text-sm text-gray-600">Positive Reviews (4+ stars)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* {!userData && (
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-4 mb-4 text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-lg">
            <p>⚠️ User not logged in. Using default lecturer ID for development.</p>
          </div>
        </div>
      )} */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-6 mb-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#132D46]">Course Management</h1>
              <p className="text-[#696E79] font-medium"> Manage your courses, assignments, and interact with students efficiently.
              </p>
            </div>
          </div>
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

                    setAssignmentForm({ course_id: '', title: '', description: '', due_date: '', attachment: null });
                    setResourceForm({ course_id: '', file_name: '', attachment: null });
                    setEditingAnnouncement(null);
                    setEditAnnouncementForm({ announcement_id: '', course_id: '', content: '', link: '', attachment: null, hasAttachment: false });
                    setSubmitMessage({ type: '', text: '' });
                    // Clear file inputs
                    const fileInputs = document.querySelectorAll('input[type="file"]');
                    fileInputs.forEach(input => input.value = '');

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
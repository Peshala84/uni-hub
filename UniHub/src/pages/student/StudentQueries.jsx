import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Send, MessageSquare, Clock, CheckCircle, AlertTriangle, BookOpen, User, Loader2, RefreshCw, Edit3, Save, X } from 'lucide-react';

const satisfactionEmojis = ['😡', '😕', '😐', '😊', '😍'];

const StudentQueries = ({ courseId, courseName, studentId }) => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [newQuery, setNewQuery] = useState({ category: '', priority: '', question: '' });
  const [selectedFeedback, setSelectedFeedback] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const [editingQuery, setEditingQuery] = useState(null);
  const [editForm, setEditForm] = useState({ category: '', priority: '', question: '' });
  const [updating, setUpdating] = useState(false);
  const [timers, setTimers] = useState({}); // Track remaining time for each query
  const [lastRefresh, setLastRefresh] = useState(null);

  // DEBUG: Log props when component receives them
  useEffect(() => {
    console.log('=== StudentQueries Props Debug ===');
    console.log('courseId received:', courseId);
    console.log('courseId type:', typeof courseId);
    console.log('courseName received:', courseName);
    console.log('studentId received:', studentId);
    console.log('courseId is valid:', courseId && !isNaN(Number(courseId)));
    console.log('===================================');
  }, [courseId, courseName, studentId]);

  // Extract fetchQueries function to be reusable
  const fetchQueries = useCallback(async (forceFetch = false) => {
    console.log('=== Fetch Queries Debug ===');
    console.log('courseId for fetch:', courseId);
    console.log('studentId for fetch:', studentId);
    console.log('courseId validation:', !courseId || isNaN(Number(courseId)));

    // Only fetch if courseId is a valid number and not empty/null/undefined
    if (!courseId || isNaN(Number(courseId)) || !studentId) {
      console.log('Skipping fetch - invalid courseId or studentId');
      if (!forceFetch) {
        setQueries([]);
        setError(null);
      }
      return;
    } setLoading(true);
    setError(null);

    try {
      const numericCourseId = Number(courseId);
      console.log('Numeric courseId:', numericCourseId);
      console.log('Fetching from URL:', `http://localhost:8086/api/v1/student/${studentId}/queries?course_Id=${numericCourseId}`);

      const response = await axios.get(`http://localhost:8086/api/v1/student/${studentId}/queries?course_Id=${numericCourseId}`);
      console.log('Queries response:', response.data);

      // Sort queries by priority first, then by creation date
      const sortedQueries = (response.data || []).sort((a, b) => {
        // Define priority order (High > Normal > Low)
        const priorityOrder = { 'High': 3, 'Normal': 2, 'Low': 1 };
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;

        console.log('Sorting query A:', {
          id: a.id || a.queryId,
          priority: a.priority,
          priorityValue: priorityA,
          question: a.question?.substring(0, 30) + '...'
        });
        console.log('Sorting query B:', {
          id: b.id || b.queryId,
          priority: b.priority,
          priorityValue: priorityB,
          question: b.question?.substring(0, 30) + '...'
        });

        // First sort by priority (higher priority first)
        if (priorityA !== priorityB) {
          const priorityResult = priorityB - priorityA; // Descending order (High priority first)
          console.log('Priority sort result:', priorityResult, priorityResult > 0 ? 'B has higher priority' : 'A has higher priority');
          return priorityResult;
        }

        // If priorities are equal, sort by creation date (most recent first)
        const dateStrA = a.createdAt || a.created_at || a.timestamp;
        const dateStrB = b.createdAt || b.created_at || b.timestamp;

        // Parse dates, use a very old date for missing timestamps to put them at the bottom
        const dateA = dateStrA ? new Date(dateStrA) : new Date('1970-01-01');
        const dateB = dateStrB ? new Date(dateStrB) : new Date('1970-01-01');

        console.log('Same priority, sorting by date - A:', dateA.toISOString(), 'B:', dateB.toISOString());

        const dateResult = dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        console.log('Date sort result:', dateResult, dateResult > 0 ? 'B is newer' : dateResult < 0 ? 'A is newer' : 'same time');

        return dateResult;
      });

      console.log('Final sorted queries:', sortedQueries.map(q => ({
        id: q.id || q.queryId,
        priority: q.priority,
        date: q.createdAt || q.created_at || q.timestamp,
        question: q.question?.substring(0, 50) + '...'
      })));

      setQueries(sortedQueries);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch queries:', error);
      setError('Failed to load queries. Please try again.');
      setQueries([]);
    } finally {
      setLoading(false);
    }
  }, [courseId, studentId]);

  // Fetch queries for the selected course
  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  // Auto-refresh queries every 30 seconds when courseId is valid
  useEffect(() => {
    if (!courseId || isNaN(Number(courseId)) || !studentId) return;

    const interval = setInterval(() => {
      fetchQueries(true);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [courseId, studentId, fetchQueries]);

  const handleInputChange = (e) => {
    setNewQuery({ ...newQuery, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== Submit Debug ===');
    console.log('courseId at submit:', courseId);
    console.log('courseId type at submit:', typeof courseId);
    console.log('newQuery state:', newQuery);

    // Validate course selection
    if (!courseId || isNaN(Number(courseId))) {
      console.log('Submit blocked - invalid courseId');
      setPopup({ show: true, message: 'Please select a valid course before submitting your query.', type: 'error' });
      return;
    }

    // Validate form inputs
    if (!newQuery.category || !newQuery.priority || !newQuery.question.trim()) {
      console.log('Submit blocked - incomplete form');
      setPopup({ show: true, message: 'Please fill in all fields before submitting.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const numericCourseId = Number(courseId);
      const payload = {
        courseId: numericCourseId,
        studentId: studentId, // hardcoded for now, replace with actual student id if available
        category: newQuery.category,
        priority: newQuery.priority,
        question: newQuery.question.trim()
      };

      console.log('=== Final Submit Payload ===');
      console.log('Payload being sent:', JSON.stringify(payload, null, 2));
      console.log('API URL:', 'http://localhost:8086/api/v1/student/5/submit');
      console.log('============================');

      const submitResponse = await axios.post(`http://localhost:8086/api/v1/student/${studentId}/submit`, payload);
      console.log('Submit response:', submitResponse.data);

      // Clear the form
      setNewQuery({ category: '', priority: '', question: '' });

      // Show success message immediately
      setPopup({ show: true, message: 'Query submitted successfully!', type: 'success' });

      // Small delay to ensure backend has processed the request
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refetch queries to get the actual data from server
      await fetchQueries(true);


    } catch (error) {
      console.error('Error submitting query:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });

      setError('Failed to submit query. Please try again.');

      // More detailed error message
      if (error.response) {
        console.error('Error response:', error.response.data);
        setPopup({ show: true, message: `Failed to submit query: ${error.response.data.message || error.response.statusText}`, type: 'error' });
      } else {
        setPopup({ show: true, message: 'Failed to submit query. Please check your connection and try again.', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async (queryId, emoji) => {
    try {
      // Update local state immediately for better UX
      setQueries(
        queries.map(q => q.queryId === queryId || q.id === queryId ? { ...q, feedback: emoji } : q)
      );
      setSelectedFeedback({ ...selectedFeedback, [queryId]: emoji });

      // Here you can add API call to save feedback to backend if needed
      console.log(`Feedback ${emoji} submitted for query ${queryId}`);

    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const refreshQueries = async () => {
    await fetchQueries(true);
  };

  // Calculate remaining time for editing (2 minutes from creation)
  const getRemainingEditTime = (createdAt) => {
    const creationTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds
    const elapsed = currentTime - creationTime;
    const remaining = twoMinutes - elapsed;
    return Math.max(0, remaining);
  };

  // Check if query can be edited (within 2 minutes)
  const canEdit = (createdAt) => {
    return getRemainingEditTime(createdAt) > 0;
  };

  // Check if query is recently uploaded (within 24 hours)
  const isRecentlyUploaded = (createdAt) => {
    const creationTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const elapsed = currentTime - creationTime;
    return elapsed <= twentyFourHours;
  };

  // Format timestamp to show relative time for recent queries
  const formatTimestamp = (createdAt) => {
    if (!createdAt) return new Date().toLocaleDateString();

    const creationTime = new Date(createdAt);
    const currentTime = new Date();
    const elapsed = currentTime - creationTime;

    const minutes = Math.floor(elapsed / (1000 * 60));
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return creationTime.toLocaleDateString();
    }
  };

  // Format remaining time for display
  const formatRemainingTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Timer effect to update remaining times and refresh timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      queries.forEach(query => {
        const remaining = getRemainingEditTime(query.createdAt || query.created_at);
        newTimers[query.queryId || query.id] = remaining;
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [queries]);

  // Separate timer to refresh relative timestamps every minute
  useEffect(() => {
    const timestampInterval = setInterval(() => {
      // Trigger re-render to update relative timestamps
      setQueries(prevQueries => [...prevQueries]);
    }, 60000); // Update every minute

    return () => clearInterval(timestampInterval);
  }, []);

  // Handle edit query
  const handleEditQuery = (query) => {
    if (!canEdit(query.createdAt || query.created_at)) {
      setPopup({ show: true, message: 'Query can only be edited within 2 minutes of creation.', type: 'error' });
      return;
    }

    setEditingQuery(query.queryId || query.id);
    setEditForm({
      category: query.category,
      priority: query.priority,
      question: query.question
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingQuery(null);
    setEditForm({ category: '', priority: '', question: '' });
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle update query
  const handleUpdateQuery = async (queryId) => {
    if (!editForm.category || !editForm.priority || !editForm.question.trim()) {
      setPopup({ show: true, message: 'Please fill in all fields before updating.', type: 'error' });
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        queryId: queryId,
        courseId: Number(courseId),
        studentId: studentId,
        question: editForm.question.trim(),
        category: editForm.category,
        priority: editForm.priority
      };

      console.log('Update payload:', payload);

      await axios.put('http://localhost:8086/api/v1/student/update/query', payload);

      // Reset edit state
      setEditingQuery(null);
      setEditForm({ category: '', priority: '', question: '' });

      // Small delay to ensure backend has processed the request
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refresh queries to get updated data from server
      await fetchQueries(true);

      setPopup({ show: true, message: 'Query updated successfully!', type: 'success' });

    } catch (error) {
      console.error('Error updating query:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setPopup({ show: true, message: error.response.data.message, type: 'error' });
      } else {
        setPopup({ show: true, message: 'Failed to update query. Please try again.', type: 'error' });
      }
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Open'
      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200'
      : 'bg-gradient-to-r from-[#2CC295]/10 to-[#2CC295]/20 text-[#2CC295] border-[#2CC295]/30';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Urgent' || priority === 'High') {
      return 'bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 border-red-200';
    }
    return 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200';
  };

  // Popup notification component
  const Popup = ({ show, message, type, onClose }) => {
    if (!show) return null;
    return (
      <div className={`fixed left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 mt-20 rounded-xl shadow-lg flex items-center space-x-3 transition-all duration-300
        ${type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'}`}
        style={{ minWidth: '300px', maxWidth: '90vw', top: '0.5rem' }}
      >
        {type === 'success' ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-red-500" />
        )}
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-lg font-bold text-gray-500 hover:text-gray-800">&times;</button>
      </div>
    );
  };

  // Auto-close popup after 3s
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => setPopup(p => ({ ...p, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  return (
    <div className="space-y-8">
      <Popup show={popup.show} message={popup.message} type={popup.type} onClose={() => setPopup(p => ({ ...p, show: false }))} />


      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Student Queries</h2>
            <p className="text-[#696E79] font-medium">
              {courseName ? `Ask questions about ${courseName}` : 'Ask questions and get help from your instructors'}
            </p>
          </div>
        </div>

        {courseId && (
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={refreshQueries}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-[#2CC295]/30 text-[#2CC295] rounded-xl hover:bg-[#2CC295]/5 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {lastRefresh && (
              <span className="text-xs text-[#696E79]">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Submit New Query */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#132D46] to-[#191E29] px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Submit New Query</span>
          </h3>
        </div>
        <div className="p-6">
          {/* Show course info or warning */}
          {(!courseId || isNaN(Number(courseId))) ? (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <strong>Please select a course from the dropdown above before submitting your query.</strong>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-[#2CC295]/5 border border-[#2CC295]/20 text-[#132D46] rounded-xl">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#2CC295]" />
                <span><strong>Selected Course:</strong> {courseName || `Course ${courseId}`}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#132D46]">Category *</label>
                <select
                  name="category"
                  value={newQuery.category}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Exams">Exams</option>
                  <option value="Lecture Content">Lecture Content</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#132D46]">Priority *</label>
                <select
                  name="priority"
                  value={newQuery.priority}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <label className="text-sm font-semibold text-[#132D46]">Your Question *</label>
              <textarea
                name="question"
                value={newQuery.question}
                onChange={handleInputChange}
                required
                placeholder="Describe your query in detail..."
                rows="4"
                className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={!courseId || isNaN(Number(courseId)) || submitting}
              className={`bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 ${(!courseId || isNaN(Number(courseId)) || submitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{submitting ? 'Submitting...' : 'Submit Query'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Queries List */}
      {courseId && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#132D46] flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#2CC295]" />
              <span>Your Queries</span>
              <span className="bg-[#2CC295]/20 text-[#2CC295] px-3 py-1 rounded-full text-sm font-semibold">
                {queries.length}
              </span>
            </h3>
            {queries.length > 0 && (
              <span className="text-sm text-[#696E79] flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Sorted by priority, then newest first</span>
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-[#2CC295]">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-medium">Loading queries...</span>
              </div>
            </div>
          ) : queries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 p-8 text-center">
              <MessageSquare className="w-12 h-12 text-[#696E79] mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-[#132D46] mb-2">No queries yet</h4>
              <p className="text-[#696E79]">Submit your first query to get started!</p>
            </div>
          ) : (
            queries.map((q, index) => (
              <div key={q.queryId || q.id} className={`bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 ${index === 0 && queries.length > 1
                  ? 'border-[#2CC295]/30 ring-2 ring-[#2CC295]/20'
                  : 'border-[#191E29]/10'
                }`}>
                {/* Query Header */}
                <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-3 flex-wrap">
                      <span className="bg-gradient-to-r from-[#132D46]/10 to-[#191E29]/10 text-[#132D46] px-4 py-2 rounded-xl text-sm font-semibold border border-[#132D46]/20">
                        {q.category}
                      </span>
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getPriorityColor(q.priority)}`}>
                        {(q.priority === 'Urgent' || q.priority === 'High') && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                        {q.priority}
                      </span>
                      {q.status && (
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(q.status)}`}>
                          {q.status === 'Resolved' ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <Clock className="w-4 h-4 inline mr-1" />}
                          {q.status}
                        </span>
                      )}
                      {/* NEW badge for recently uploaded queries */}
                      {isRecentlyUploaded(q.createdAt || q.created_at) && (
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Edit button with timer */}
                      {(!q.response && q.status !== 'Resolved') && (
                        <div className="flex items-center space-x-2">
                          {canEdit(q.createdAt || q.created_at) ? (
                            <>
                              <button
                                onClick={() => handleEditQuery(q)}
                                className="flex items-center space-x-1 px-3 py-2 bg-white border border-[#2CC295]/30 text-[#2CC295] rounded-xl hover:bg-[#2CC295]/5 transition-all duration-200"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span className="text-sm font-medium">Edit</span>
                              </button>
                              <span className="text-xs text-[#2CC295] font-medium bg-[#2CC295]/10 px-2 py-1 rounded-lg flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatRemainingTime(timers[q.queryId || q.id] || 0)}</span>
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-2 rounded-xl">
                              Edit time expired
                            </span>
                          )}
                        </div>
                      )}
                      <span className="text-[#696E79] text-sm font-medium flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimestamp(q.createdAt || q.created_at || q.timestamp)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Query Content */}
                <div className="p-6 space-y-4">
                  {editingQuery === (q.queryId || q.id) ? (
                    /* Edit Form */
                    <div className="bg-[#F8FFFE] rounded-xl p-4 border-l-4 border-[#2CC295]">
                      <h4 className="font-semibold text-[#132D46] mb-4 flex items-center space-x-2">
                        <Edit3 className="w-4 h-4 text-[#2CC295]" />
                        <span>Edit Your Query:</span>
                      </h4>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#132D46]">Category *</label>
                            <select
                              name="category"
                              value={editForm.category}
                              onChange={handleEditFormChange}
                              required
                              className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                            >
                              <option value="">Select Category</option>
                              <option value="Programming">Programming</option>
                              <option value="Assignment">Assignment</option>
                              <option value="Exams">Exams</option>
                              <option value="Lecture Content">Lecture Content</option>
                              <option value="General">General</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#132D46]">Priority *</label>
                            <select
                              name="priority"
                              value={editForm.priority}
                              onChange={handleEditFormChange}
                              required
                              className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                            >
                              <option value="">Select Priority</option>
                              <option value="High">High</option>
                              <option value="Normal">Normal</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#132D46]">Your Question *</label>
                          <textarea
                            name="question"
                            value={editForm.question}
                            onChange={handleEditFormChange}
                            required
                            placeholder="Describe your query in detail..."
                            rows="4"
                            className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                          <button
                            onClick={() => handleUpdateQuery(q.queryId || q.id)}
                            disabled={updating}
                            className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                          >
                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{updating ? 'Updating...' : 'Save Changes'}</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={updating}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Normal View */
                    <div className="bg-[#F8FFFE] rounded-xl p-4 border-l-4 border-[#2CC295]">
                      <h4 className="font-semibold text-[#132D46] mb-2 flex items-center space-x-2">
                        <User className="w-4 h-4 text-[#2CC295]" />
                        <span>Your Question:</span>
                      </h4>
                      <p className="text-[#132D46] font-medium">{q.question}</p>
                    </div>
                  )}

                  {q.response && (
                    <div className="bg-gradient-to-r from-[#2CC295]/5 to-[#2CC295]/10 rounded-xl p-4 border-l-4 border-[#2CC295]">
                      <h4 className="font-semibold text-[#132D46] mb-2 flex items-center space-x-2">
                        <User className="w-4 h-4 text-[#2CC295]" />
                        <span>Instructor Response:</span>
                      </h4>
                      <p className="text-[#132D46] font-medium">{q.response}</p>
                    </div>
                  )}

                  {q.status === 'Resolved' && (
                    <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] rounded-xl p-4 border border-[#2CC295]/30">
                      <h4 className="font-semibold text-[#132D46] mb-3">Rate this response:</h4>
                      <div className="flex items-center space-x-3">
                        {satisfactionEmojis.map(emoji => (
                          <button
                            key={emoji}
                            className={`text-2xl p-2 rounded-xl transition-all duration-200 hover:scale-110 ${q.feedback === emoji
                              ? 'bg-[#2CC295] shadow-lg ring-4 ring-[#2CC295]/30'
                              : 'bg-white hover:bg-[#2CC295]/10 shadow-md border border-[#191E29]/10'
                              }`}
                            onClick={() => handleFeedback(q.queryId || q.id, emoji)}
                            disabled={!!q.feedback}
                          >
                            {emoji}
                          </button>
                        ))}
                        {q.feedback && (
                          <span className="ml-4 text-[#2CC295] font-semibold flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Thank you for your feedback!</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentQueries;
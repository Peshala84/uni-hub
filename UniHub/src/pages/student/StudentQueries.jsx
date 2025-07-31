import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, MessageSquare, Clock, CheckCircle, AlertTriangle, BookOpen, User, Loader2, RefreshCw } from 'lucide-react';

const satisfactionEmojis = ['😡', '😕', '😐', '😊', '😍'];

const StudentQueries = ({ courseId, courseName }) => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [newQuery, setNewQuery] = useState({ category: '', priority: '', question: '' });
  const [selectedFeedback, setSelectedFeedback] = useState({});

  // DEBUG: Log props when component receives them
  useEffect(() => {
    console.log('=== StudentQueries Props Debug ===');
    console.log('courseId received:', courseId);
    console.log('courseId type:', typeof courseId);
    console.log('courseName received:', courseName);
    console.log('courseId is valid:', courseId && !isNaN(Number(courseId)));
    console.log('===================================');
  }, [courseId, courseName]);

  // Fetch queries for the selected course
  useEffect(() => {
    const fetchQueries = async () => {
      console.log('=== Fetch Queries Debug ===');
      console.log('courseId for fetch:', courseId);
      console.log('courseId validation:', !courseId || isNaN(Number(courseId)));

      // Only fetch if courseId is a valid number and not empty/null/undefined
      if (!courseId || isNaN(Number(courseId))) {
        console.log('Skipping fetch - invalid courseId');
        setQueries([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const numericCourseId = Number(courseId);
        console.log('Numeric courseId:', numericCourseId);
        console.log('Fetching from URL:', `http://localhost:8086/api/v1/student/1/queries?course_Id=${numericCourseId}`);

        const response = await axios.get(`http://localhost:8086/api/v1/student/1/queries?course_Id=${numericCourseId}`);
        console.log('Queries response:', response.data);

        setQueries(response.data || []);
      } catch (error) {
        console.error('Failed to fetch queries:', error);
        setError('Failed to load queries. Please try again.');
        setQueries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [courseId]);

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
      alert('Please select a valid course before submitting your query.');
      return;
    }

    // Validate form inputs
    if (!newQuery.category || !newQuery.priority || !newQuery.question.trim()) {
      console.log('Submit blocked - incomplete form');
      alert('Please fill in all fields before submitting.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const numericCourseId = Number(courseId);
      const payload = {
        courseId: numericCourseId,
        studentId: 1, // hardcoded for now, replace with actual student id if available
        category: newQuery.category,
        priority: newQuery.priority,
        question: newQuery.question.trim()
      };

      console.log('=== Final Submit Payload ===');
      console.log('Payload being sent:', JSON.stringify(payload, null, 2));
      console.log('API URL:', 'http://localhost:8086/api/v1/student/1/submit');
      console.log('============================');

      const submitResponse = await axios.post('http://localhost:8086/api/v1/student/1/submit', payload);
      console.log('Submit response:', submitResponse.data);

      // Clear the form
      setNewQuery({ category: '', priority: '', question: '' });

      // Refetch queries to show the new one
      const queriesResponse = await axios.get(`http://localhost:8086/api/v1/student/1/queries?course_Id=${numericCourseId}`);
      setQueries(queriesResponse.data || []);

      // Show success message
      alert('Query submitted successfully!');

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
        alert(`Failed to submit query: ${error.response.data.message || error.response.statusText}`);
      } else {
        alert('Failed to submit query. Please check your connection and try again.');
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
    if (!courseId || isNaN(Number(courseId))) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8086/api/v1/student/1/queries?course_Id=${Number(courseId)}`);
      setQueries(response.data || []);
      setError(null);
    } catch (error) {
      setError('Failed to refresh queries.');
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-8">
      

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
          <button
            onClick={refreshQueries}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-[#2CC295]/30 text-[#2CC295] rounded-xl hover:bg-[#2CC295]/5 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
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
            queries.map(q => (
              <div key={q.queryId || q.id} className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
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
                    </div>
                    <span className="text-[#696E79] text-sm font-medium flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{q.timestamp || new Date().toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                {/* Query Content */}
                <div className="p-6 space-y-4">
                  <div className="bg-[#F8FFFE] rounded-xl p-4 border-l-4 border-[#2CC295]">
                    <h4 className="font-semibold text-[#132D46] mb-2 flex items-center space-x-2">
                      <User className="w-4 h-4 text-[#2CC295]" />
                      <span>Your Question:</span>
                    </h4>
                    <p className="text-[#132D46] font-medium">{q.question}</p>
                  </div>

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

                  {!q.response && q.status !== 'Resolved' && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center space-x-2 text-blue-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Waiting for instructor response...</span>
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


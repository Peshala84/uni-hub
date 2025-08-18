import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, Paperclip, ThumbsUp, CheckCircle, User, Search, Filter, Plus, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8086/api/v1/peer-learning';

// Temporary mock data until backend endpoints are implemented
const mockQuestions = [
  {
    id: 1,
    questionText: "How do you implement a binary search tree in Java?",
    priority: "High",
    category: "Concepts",
    studentId: 2,
    studentName: "Alice Johnson",
    courseId: 1,
    courseName: "Data Structures",
    createdAt: "2024-01-15T10:30:00Z",
    upvotes: 5,
    isResolved: false,
    answers: [
      {
        id: 1,
        answerText: "A binary search tree is implemented using a Node class with left and right pointers. Here's a basic structure...",
        studentId: 3,
        studentName: "Bob Smith",
        createdAt: "2024-01-15T11:00:00Z",
        upvotes: 3,
        isAccepted: false
      }
    ]
  },
  {
    id: 2,
    questionText: "What's the difference between ArrayList and LinkedList in Java?",
    priority: "Normal",
    category: "Concepts",
    studentId: 4,
    studentName: "Carol Davis",
    courseId: 1,
    courseName: "Data Structures",
    createdAt: "2024-01-14T14:20:00Z",
    upvotes: 8,
    isResolved: true,
    answers: [
      {
        id: 2,
        answerText: "ArrayList uses a dynamic array internally, providing O(1) access time but O(n) insertion/deletion. LinkedList uses doubly-linked nodes, providing O(1) insertion/deletion but O(n) access time.",
        studentId: 5,
        studentName: "David Wilson",
        createdAt: "2024-01-14T15:00:00Z",
        upvotes: 12,
        isAccepted: true
      }
    ]
  },
  {
    id: 3,
    questionText: "Need help with React useEffect dependencies array",
    priority: "High",
    category: "Assignment Help",
    studentId: 6,
    studentName: "Eva Brown",
    courseId: 2,
    courseName: "Web Development",
    createdAt: "2024-01-16T09:15:00Z",
    upvotes: 2,
    isResolved: false,
    answers: []
  }
];

const categories = ['All', 'Assignment Help', 'Concepts', 'Exam Prep', 'Projects', 'Other'];

const PeerLearning = ({ currentUserId = 1, currentCourseId = null }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQ, setNewQ] = useState({
    questionText: '',
    priority: 'Normal',
    category: 'Other',
    courseId: currentCourseId
  });
  const [answer, setAnswer] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load questions on component mount and when filters change
  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, sortBy, searchTerm, currentCourseId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      // Try real API first, fallback to mock data if backend endpoints don't exist
      try {
        const params = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          sortBy,
          searchTerm: searchTerm.trim() || undefined
        };

        let response;
        if (currentCourseId) {
          response = await axios.get(`${API_BASE_URL}/questions/course/${currentCourseId}`, { params });
        } else {
          response = await axios.get(`${API_BASE_URL}/questions`, { params });
        }

        setQuestions(response.data || []);

      } catch (apiError) {
        // If API fails (404), use mock data as fallback
        console.warn('Backend endpoints not implemented yet, using mock data:', apiError.message);

        let filteredQuestions = [...mockQuestions];

        // Apply category filter
        if (selectedCategory !== 'All') {
          filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory);
        }

        // Apply course filter
        if (currentCourseId) {
          filteredQuestions = filteredQuestions.filter(q => q.courseId === currentCourseId);
        }

        // Apply search filter
        if (searchTerm.trim()) {
          const search = searchTerm.toLowerCase();
          filteredQuestions = filteredQuestions.filter(q =>
            q.questionText.toLowerCase().includes(search) ||
            q.studentName.toLowerCase().includes(search) ||
            q.courseName.toLowerCase().includes(search)
          );
        }

        // Apply sorting
        if (sortBy === 'recent') {
          filteredQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'popular') {
          filteredQuestions.sort((a, b) => b.upvotes - a.upvotes);
        } else if (sortBy === 'priority') {
          const priorityOrder = { 'High': 3, 'Normal': 2, 'Low': 1 };
          filteredQuestions.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        }

        setQuestions(filteredQuestions);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please try again.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQChange = (e) => {
    setNewQ({ ...newQ, [e.target.name]: e.target.value });
  };

  const handleQSubmit = async () => {
    if (!newQ.questionText.trim()) {
      setError('Please enter a question');
      return;
    }

    try {
      setError('');

      // Try real API first, fallback to mock data if backend endpoints don't exist
      try {
        const questionData = {
          ...newQ,
          studentId: currentUserId,
          courseId: currentCourseId || newQ.courseId
        };

        await axios.post(`${API_BASE_URL}/questions`, questionData);

      } catch (apiError) {
        // If API fails (404), use mock data as fallback
        console.warn('Backend endpoint not implemented yet, using mock data:', apiError.message);

        const newQuestion = {
          id: mockQuestions.length + 1,
          questionText: newQ.questionText,
          priority: newQ.priority,
          category: newQ.category,
          studentId: currentUserId,
          studentName: "You", // In real implementation, get from user context
          courseId: currentCourseId || newQ.courseId,
          courseName: "Current Course", // In real implementation, get from course data
          createdAt: new Date().toISOString(),
          upvotes: 0,
          isResolved: false,
          answers: []
        };

        mockQuestions.unshift(newQuestion); // Add to beginning of array
      }

      setSuccessMessage('Question posted successfully!');
      setNewQ({
        questionText: '',
        priority: 'Normal',
        category: 'Other',
        courseId: currentCourseId
      });

      // Reload questions
      loadQuestions();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error creating question:', err);
      setError('Failed to post question. Please try again.');
    }
  };

  const handleAnswerChange = (id, value) => {
    setAnswer({ ...answer, [id]: value });
  };

  const handleAnswerSubmit = async (questionId) => {
    if (!answer[questionId]?.trim()) {
      return;
    }

    try {
      setError('');

      // Try real API first, fallback to mock data if backend endpoints don't exist
      try {
        const answerData = {
          questionId,
          studentId: currentUserId,
          answerText: answer[questionId]
        };

        await axios.post(`${API_BASE_URL}/answers`, answerData);

      } catch (apiError) {
        // If API fails (404), use mock data as fallback
        console.warn('Backend endpoint not implemented yet, using mock data:', apiError.message);

        const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
          const newAnswer = {
            id: Date.now(), // Simple ID generation for mock
            answerText: answer[questionId],
            studentId: currentUserId,
            studentName: "You", // In real implementation, get from user context
            createdAt: new Date().toISOString(),
            upvotes: 0,
            isAccepted: false
          };

          mockQuestions[questionIndex].answers.push(newAnswer);
        }
      }

      setAnswer({ ...answer, [questionId]: '' });
      setSuccessMessage('Answer posted successfully!');

      // Reload questions to show the new answer
      loadQuestions();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error creating answer:', err);
      setError('Failed to post answer. Please try again.');
    }
  };

  const handleUpvote = async (questionId, answerId = null) => {
    try {
      setError('');

      // Try real API first, fallback to mock data if backend endpoints don't exist
      try {
        const upvoteData = {
          studentId: currentUserId,
          questionId: answerId ? null : questionId,
          answerId: answerId
        };

        const endpoint = answerId ? '/answers/upvote' : '/questions/upvote';
        await axios.post(`${API_BASE_URL}${endpoint}`, upvoteData);

      } catch (apiError) {
        // If API fails (404), use mock data as fallback
        console.warn('Backend endpoint not implemented yet, using mock data:', apiError.message);

        if (answerId) {
          // Upvote an answer
          const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
          if (questionIndex !== -1) {
            const answerIndex = mockQuestions[questionIndex].answers.findIndex(a => a.id === answerId);
            if (answerIndex !== -1) {
              mockQuestions[questionIndex].answers[answerIndex].upvotes += 1;
            }
          }
        } else {
          // Upvote a question
          const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
          if (questionIndex !== -1) {
            mockQuestions[questionIndex].upvotes += 1;
          }
        }
      }

      // Reload questions to show updated upvote counts
      loadQuestions();
    } catch (err) {
      console.error('Error toggling upvote:', err);
      setError('Failed to update upvote. Please try again.');
    }
  };

  const handleAcceptAnswer = async (answerId, questionId) => {
    try {
      setError('');

      // Try real API first, fallback to mock data if backend endpoints don't exist
      try {
        await axios.put(`${API_BASE_URL}/answers/${answerId}/accept`, null, {
          params: { questionId, studentId: currentUserId }
        });

      } catch (apiError) {
        // If API fails (404), use mock data as fallback
        console.warn('Backend endpoint not implemented yet, using mock data:', apiError.message);

        const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
          const question = mockQuestions[questionIndex];

          // Check if user owns the question
          if (question.studentId !== currentUserId) {
            setError('You can only accept answers to your own questions.');
            return;
          }

          // Mark all answers as not accepted first
          question.answers.forEach(answer => {
            answer.isAccepted = false;
          });

          // Mark the selected answer as accepted
          const answerIndex = question.answers.findIndex(a => a.id === answerId);
          if (answerIndex !== -1) {
            question.answers[answerIndex].isAccepted = true;
            question.isResolved = true;
          }
        }
      }

      setSuccessMessage('Answer accepted successfully!');

      // Reload questions to show the accepted answer
      loadQuestions();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error accepting answer:', err);
      if (err.response?.status === 403) {
        setError('You can only accept answers to your own questions.');
      } else {
        setError('Failed to accept answer. Please try again.');
      }
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setError('');

      // Try real API first, fallback to mock data if backend endpoints don't exist
      try {
        await axios.delete(`${API_BASE_URL}/questions/${questionId}`, {
          params: { studentId: currentUserId }
        });

      } catch (apiError) {
        // If API fails (404), use mock data as fallback
        console.warn('Backend endpoint not implemented yet, using mock data:', apiError.message);

        const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
          const question = mockQuestions[questionIndex];

          // Check if user owns the question
          if (question.studentId !== currentUserId) {
            setError('You can only delete your own questions.');
            return;
          }

          // Remove the question from mock data
          mockQuestions.splice(questionIndex, 1);
        }
      }

      setSuccessMessage('Question deleted successfully!');

      // Reload questions
      loadQuestions();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting question:', err);
      if (err.response?.status === 403) {
        setError('You can only delete your own questions.');
      } else {
        setError('Failed to delete question. Please try again.');
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Peer Learning Hub
          {currentCourseId && <span className="text-lg font-normal text-gray-600 ml-2">(Course Specific)</span>}
        </h2>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X size={16} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="text-green-500 hover:text-green-700">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search questions and answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="unanswered">Unanswered First</option>
          </select>

          <button
            onClick={loadQuestions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search size={16} />
            Refresh
          </button>
        </div>

        {/* Ask Question Form */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            <textarea
              name="questionText"
              value={newQ.questionText}
              onChange={handleQChange}
              placeholder="What's your question? Be specific and include relevant details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />

            <div className="flex flex-wrap gap-3">
              <select
                name="category"
                value={newQ.category}
                onChange={handleQChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                name="priority"
                value={newQ.priority}
                onChange={handleQChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Normal">Normal Priority</option>
                <option value="Urgent">Urgent</option>
              </select>

              <button
                type="button"
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <Paperclip size={16} />
                Attach File
              </button>

              <button
                onClick={handleQSubmit}
                disabled={!newQ.questionText.trim()}
                className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={16} />
                Post Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No questions found. Be the first to ask!
          </div>
        ) : (
          questions.map(q => (
            <div key={q.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {q.isResolved && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle size={16} />
                          Resolved
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${q.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                        }`}>
                        {q.priority}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {q.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{q.questionText}</h3>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {q.studentName || 'Anonymous'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTimestamp(q.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        {q.answers?.length || 0} answers
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvote(q.id)}
                      className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp size={20} />
                      <span className="text-sm font-medium">{q.upvotes || 0}</span>
                    </button>

                    {q.studentId === currentUserId && (
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Answers */}
                {q.answers && q.answers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {q.answers.map(a => (
                      <div key={a.id} className={`pl-4 border-l-2 ${a.isAccepted ? 'border-green-500' : 'border-gray-200'
                        }`}>
                        <p className="text-gray-700 mb-2">{a.answerText}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {a.studentName || 'Anonymous'}
                            </span>
                            <span>{formatTimestamp(a.createdAt)}</span>
                            {a.isAccepted && (
                              <span className="text-green-600 font-medium">✓ Accepted Answer</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {!q.isResolved && q.studentId === currentUserId && !a.isAccepted && (
                              <button
                                onClick={() => handleAcceptAnswer(a.id, q.id)}
                                className="text-sm text-green-600 hover:text-green-700"
                              >
                                Accept
                              </button>
                            )}
                            <button
                              onClick={() => handleUpvote(q.id, a.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <ThumbsUp size={16} />
                              <span className="text-sm">{a.upvotes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Input */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      value={answer[q.id] || ''}
                      onChange={e => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Share your answer..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAnswerSubmit(q.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAnswerSubmit(q.id)}
                      disabled={!answer[q.id]?.trim()}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Answer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PeerLearning;
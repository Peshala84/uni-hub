import React, { useEffect, useState } from 'react';
import { MessageSquare, Reply, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContexts.jsx';

const Queries = () => {
  // Auth and params
  const { userId, userRole } = useAuth?.() || {};
  // Temporary override as requested: use lecturerId = 1
  const lecturerId = 1;

  // API config (no new files, configurable via Vite envs)
  const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8086').replace(/\/$/, '');
  // You can override these with Vite envs if your backend uses different base paths
  const GET_QUERIES_PATH_TEMPLATE = import.meta?.env?.VITE_GET_QUERIES_PATH || '/api/v1/lecturer/{lecturerId}/queries';
  const POST_REPLY_PATH_TEMPLATE = import.meta?.env?.VITE_POST_REPLY_PATH || '/api/v1/lecturer/{queryId}/reply';

  const buildUrl = (template, paramsObj) => {
    let path = template;
    Object.entries(paramsObj).forEach(([k, v]) => {
      path = path.replace(`{${k}}`, encodeURIComponent(String(v)));
    });
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // Normalize server response to UI shape
  const normalizeQuery = (q) => {
    if (!q) return null;
    const idCandidate = q.queryId ?? q.id ?? q._id ?? q.queryID ?? q.query_id ?? q.qid ?? q.QID;
    return {
      id: idCandidate,
      queryId: idCandidate,
      studentId: q.studentId ?? q.student?.id ?? q.student_id ?? q.student?.studentId ?? 'unknown',
      question: q.question ?? q.message ?? q.content ?? q.body ?? '',
      // Back-compat fields (still used by filters/search)
      subject: q.subject ?? q.title ?? '',
      message: q.message ?? q.content ?? q.body ?? '',
      timestamp: q.timestamp ?? q.createdAt ?? q.created_at ?? new Date().toISOString(),
      status: (q.status ?? 'pending').toLowerCase(),
      priority: (q.priority ?? 'medium').toLowerCase(),
      category: q.category ?? 'general',
    };
  };

  // Fetch queries for lecturer
  useEffect(() => {
    let isMounted = true;
    const fetchQueries = async () => {
      if (!lecturerId) return;
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const url = buildUrl(GET_QUERIES_PATH_TEMPLATE, { lecturerId });
        const res = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const normalized = list.map(normalizeQuery).filter(Boolean);
        if (isMounted) {
          setQueries(normalized);
          // Auto-select first query if nothing selected
          if (!selectedQuery && normalized.length > 0) setSelectedQuery(normalized[0]);
        }
      } catch (err) {
        console.error('Failed to fetch queries', err);
        if (isMounted) setError('Failed to load queries.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchQueries();
    return () => {
      isMounted = false;
    };
  }, [lecturerId]);

  const filteredQueries = queries.filter(query => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (query.question || '').toLowerCase().includes(term) ||
      String(query.id || '').toLowerCase().includes(term) ||
      String(query.studentId || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  // No timestamp formatting displayed in the simplified view

  const handleSendReply = async () => {
    if (!selectedQuery || !replyMessage.trim()) return;
    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const qid = selectedQuery.queryId ?? selectedQuery.id ?? selectedQuery._id;
      if (!qid) {
        console.error('No queryId on selectedQuery:', selectedQuery);
        alert('Cannot send reply: queryId is missing.');
        return;
      }
      const url = buildUrl(POST_REPLY_PATH_TEMPLATE, { queryId: qid });
      await axios.post(
        url,
        { reply: replyMessage.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      // Optimistic UI update
      setQueries((prev) =>
        prev.map((q) => (q.id === qid ? { ...q, status: 'answered' } : q))
      );
      setReplyMessage('');
      // Optionally refetch to stay in sync
      // ...
      alert('Reply sent successfully');
    } catch (err) {
      console.error('Failed to send reply', err);
      alert('Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  // No resolve action in the simplified view

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Student Queries</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by queryId, studentId, or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Queries List: only queryId, studentId, question */}
        <div className="space-y-4 overflow-y-auto max-h-96">
          {loading && (
            <div className="py-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-300 animate-pulse" />
              <p>Loading queries...</p>
            </div>
          )}
          {!loading && error && (
            <div className="py-8 text-center text-red-600">{error}</div>
          )}
          {!loading && !error && filteredQueries.map((query) => (
            <div
              key={query.id}
              onClick={() => setSelectedQuery(query)}
              className={`border-l-4 ${getPriorityColor(query.priority)} bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${selectedQuery?.id === query.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="space-y-1">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Query ID:</span> {query.id}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Student ID:</span> {query.studentId}
                </div>
                <div className="text-gray-800 line-clamp-2">
                  <span className="font-medium">Question:</span> {query.question}
                </div>
              </div>
            </div>
          ))}

          {!loading && !error && filteredQueries.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No queries match your search criteria</p>
            </div>
          )}
        </div>

        {/* Query Details: only queryId, studentId, question */}
        <div className="p-6 rounded-lg bg-gray-50 min-h-96">
          {selectedQuery ? (
            <div className="space-y-6">
              <div>
                <div className="p-4 space-y-2 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Query ID:</span> {selectedQuery.queryId ?? selectedQuery.id}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Student ID:</span> {selectedQuery.studentId}
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="mb-1 font-medium text-gray-800">Question</div>
                    <p className="leading-relaxed text-gray-700">{selectedQuery.question}</p>
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <h4 className="mb-3 font-medium text-gray-800">Send Reply</h4>
                <div className="space-y-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || sending}
                      className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Reply className="w-4 h-4" />
                      <span>{sending ? 'Sending...' : 'Send Reply'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                {!lecturerId ? (
                  <p>Lecturer ID not found. Provide it in the route or login as a lecturer.</p>
                ) : (
                  <p>Select a query to view details and reply</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Queries;
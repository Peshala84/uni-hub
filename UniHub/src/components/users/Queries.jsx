import React, { useState } from 'react';
import { MessageSquare, User, Clock, Reply, Search, CheckCircle } from 'lucide-react';

const mockQueries = [
  {
    id: 1,
    student: {
      name: 'John Smith',
      email: 'john.smith@student.edu',
      course: 'CS301 - Advanced Algorithms'
    },
    subject: 'Question about Assignment 3 - Dynamic Programming',
    message: 'Hi Professor, I\'m having trouble understanding the optimal substructure property in the knapsack problem. Could you provide some additional examples or clarification on how to identify when a problem has this property?',
    timestamp: '2024-01-15T14:30:00Z',
    status: 'pending',
    priority: 'medium',
    category: 'assignment'
  },
  {
    id: 2,
    student: {
      name: 'Sarah Johnson',
      email: 'sarah.j@student.edu',
      course: 'CS202 - Database Systems'
    },
    subject: 'Clarification on Lecture 5 - Normalization',
    message: 'I attended today\'s lecture on database normalization but I\'m still confused about the difference between 2NF and 3NF. Could you explain with a practical example?',
    timestamp: '2024-01-14T16:45:00Z',
    status: 'answered',
    priority: 'high',
    category: 'lecture'
  },
  {
    id: 3,
    student: {
      name: 'Mike Wilson',
      email: 'mike.w@student.edu',
      course: 'CS301 - Advanced Algorithms'
    },
    subject: 'Grade inquiry for Midterm Exam',
    message: 'I received my midterm grade and I believe there might be an error in the grading of question 4. I showed all my work but received no partial credit. Could you please review it?',
    timestamp: '2024-01-13T10:20:00Z',
    status: 'resolved',
    priority: 'high',
    category: 'grade'
  }
];

const Queries = () => {
  const [queries, setQueries] = useState(mockQueries);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyMessage, setReplyMessage] = useState('');

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'answered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendReply = () => {
    if (selectedQuery && replyMessage.trim()) {
      // In a real app, this would send the reply to the backend
      setQueries(prev => prev.map(query => 
        query.id === selectedQuery.id 
          ? { ...query, status: 'answered' }
          : query
      ));
      setReplyMessage('');
      alert('Reply sent successfully!');
    }
  };

  const markAsResolved = (queryId) => {
    setQueries(prev => prev.map(query => 
      query.id === queryId 
        ? { ...query, status: 'resolved' }
        : query
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Student Queries</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="answered">Answered</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queries List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredQueries.map((query) => (
            <div
              key={query.id}
              onClick={() => setSelectedQuery(query)}
              className={`border-l-4 ${getPriorityColor(query.priority)} bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
                selectedQuery?.id === query.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-800 line-clamp-1">{query.subject}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(query.status)}`}>
                  {query.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{query.student.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(query.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2">{query.message}</p>
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {query.student.course}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  query.priority === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : query.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {query.priority} priority
                </span>
              </div>
            </div>
          ))}
          
          {filteredQueries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No queries match your search criteria</p>
            </div>
          )}
        </div>

        {/* Query Details */}
        <div className="bg-gray-50 rounded-lg p-6 min-h-96">
          {selectedQuery ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedQuery.subject}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedQuery.status)}`}>
                      {selectedQuery.status}
                    </span>
                    {selectedQuery.status !== 'resolved' && (
                      <button
                        onClick={() => markAsResolved(selectedQuery.id)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{selectedQuery.student.name}</p>
                      <p className="text-sm text-gray-600">{selectedQuery.student.email}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-gray-700 leading-relaxed">{selectedQuery.message}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{selectedQuery.student.course}</span>
                    <span className="text-xs text-gray-500">{formatTimestamp(selectedQuery.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Send Reply</h4>
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
                      disabled={!replyMessage.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a query to view details and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Queries;
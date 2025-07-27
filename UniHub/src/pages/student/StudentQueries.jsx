
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContexts';
import { Send, MessageSquare, Clock, CheckCircle, AlertTriangle, BookOpen, User } from 'lucide-react';


const mockQueries = [
  {
    id: 1,
    category: 'Assignment',
    ticket: 'Urgent',
    status: 'Open',
    question: 'When is the assignment 2 deadline?',
    response: 'Assignment 2 is due on August 10th.',
    feedback: null,
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    category: 'Exams',
    ticket: 'Normal',
    status: 'Resolved',
    question: 'Will the exam be open book?',
    response: 'No, the exam is closed book.',
    feedback: '😊',
    timestamp: '1 day ago'
  }
];

const satisfactionEmojis = ['😡', '😕', '😐', '😊', '😍'];

const StudentQueries = () => {
  const [queries, setQueries] = useState(mockQueries);
  const [newQuery, setNewQuery] = useState({ category: '', ticket: '', question: '' });
  const [selectedFeedback, setSelectedFeedback] = useState({});

  const handleInputChange = (e) => {
    setNewQuery({ ...newQuery, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQueries([
      ...queries,
      {
        id: queries.length + 1,
        ...newQuery,
        status: 'Open',
        response: '',
        feedback: null,
        timestamp: 'Just now'
      }
    ]);
    setNewQuery({ category: '', ticket: '', question: '' });
  };

  const handleFeedback = (id, emoji) => {
    setQueries(
      queries.map(q => q.id === id ? { ...q, feedback: emoji } : q)
    );
    setSelectedFeedback({ ...selectedFeedback, [id]: emoji });
  };

  const getStatusColor = (status) => {
    return status === 'Open' 
      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200' 
      : 'bg-gradient-to-r from-[#2CC295]/10 to-[#2CC295]/20 text-[#2CC295] border-[#2CC295]/30';
  };

  const getTicketColor = (ticket) => {
    return ticket === 'Urgent' 
      ? 'bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 border-red-200' 
      : 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Student Queries</h2>
          <p className="text-[#696E79] font-medium">Ask questions and get help from your instructors</p>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#132D46]">Category</label>
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
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#132D46]">Priority</label>
              <select 
                name="ticket" 
                value={newQuery.ticket} 
                onChange={handleInputChange} 
                required 
                className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
              >
                <option value="">Select Priority</option>
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-[#132D46]">Your Question</label>
            <textarea 
              name="question" 
              value={newQuery.question} 
              onChange={handleInputChange} 
              required 
              placeholder="Describe your query in detail..."
              rows="3"
              className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
            />
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Submit Query</span>
          </button>
        </div>
      </div>

      {/* Queries List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#132D46] flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-[#2CC295]" />
          <span>Your Queries</span>
          <span className="bg-[#2CC295]/20 text-[#2CC295] px-3 py-1 rounded-full text-sm font-semibold">
            {queries.length}
          </span>
        </h3>
        
        {queries.map(q => (
          <div key={q.id} className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Query Header */}
            <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-gradient-to-r from-[#132D46]/10 to-[#191E29]/10 text-[#132D46] px-4 py-2 rounded-xl text-sm font-semibold border border-[#132D46]/20">
                    {q.category}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getTicketColor(q.ticket)}`}>
                    {q.ticket === 'Urgent' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                    {q.ticket}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(q.status)}`}>
                    {q.status === 'Resolved' ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <Clock className="w-4 h-4 inline mr-1" />}
                    {q.status}
                  </span>
                </div>
                <span className="text-[#696E79] text-sm font-medium flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{q.timestamp}</span>
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
                        className={`text-2xl p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                          q.feedback === emoji 
                            ? 'bg-[#2CC295] shadow-lg ring-4 ring-[#2CC295]/30' 
                            : 'bg-white hover:bg-[#2CC295]/10 shadow-md border border-[#191E29]/10'
                        }`}
                        onClick={() => handleFeedback(q.id, emoji)}
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
        ))}
      </div>
    </div>
  );
};

export default StudentQueries;


import React, { useState } from 'react';
import { MessageCircle, Clock, Paperclip, ThumbsUp, CheckCircle, User, Search, Filter } from 'lucide-react';

const mockQuestions = [
  {
    id: 1,
    question: 'How to solve question 3 in assignment 2?',
    priority: 'Urgent',
    category: 'Assignment Help',
    author: 'John Doe',
    timestamp: '2 hours ago',
    attachments: [],
    upvotes: 5,
    isResolved: false,
    answers: [
      { 
        id: 1, 
        answer: 'To solve question 3, first refer to lecture notes from week 4. The key concept is understanding the recursive algorithm. Start by identifying the base case, then work through the recursive calls step by step.', 
        author: 'Jane Smith',
        timestamp: '1 hour ago',
        upvotes: 3,
        isAccepted: false,
        attachments: [] 
      }
    ]
  },
  {
    id: 2,
    question: 'Can someone explain the difference between BFS and DFS algorithms?',
    priority: 'Normal',
    category: 'Concepts',
    author: 'Alice Johnson',
    timestamp: '5 hours ago',
    attachments: [],
    upvotes: 8,
    isResolved: true,
    answers: [
      { 
        id: 1, 
        answer: 'BFS (Breadth-First Search) explores nodes level by level, using a queue. DFS (Depth-First Search) explores as far as possible along each branch before backtracking, using a stack or recursion.', 
        author: 'Bob Wilson',
        timestamp: '4 hours ago',
        upvotes: 6,
        isAccepted: true,
        attachments: [] 
      }
    ]
  }
];

const categories = ['All', 'Assignment Help', 'Concepts', 'Exam Prep', 'Projects', 'Other'];

const PeerLearning = () => {
  const [questions, setQuestions] = useState(mockQuestions);
  const [newQ, setNewQ] = useState({ question: '', priority: 'Normal', category: 'Other', attachments: [] });
  const [answer, setAnswer] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const handleQChange = (e) => {
    setNewQ({ ...newQ, [e.target.name]: e.target.value });
  };

  const handleQSubmit = () => {
    if (!newQ.question) return;
    const newQuestion = {
      id: questions.length + 1,
      ...newQ,
      author: 'Current User',
      timestamp: 'Just now',
      upvotes: 0,
      isResolved: false,
      answers: []
    };
    setQuestions([newQuestion, ...questions]);
    setNewQ({ question: '', priority: 'Normal', category: 'Other', attachments: [] });
  };

  const handleAnswerChange = (id, value) => {
    setAnswer({ ...answer, [id]: value });
  };

  const handleAnswerSubmit = (qid) => {
    if (!answer[qid]) return;
    
    const newAnswer = {
      id: Date.now(),
      answer: answer[qid],
      author: 'Current User',
      timestamp: 'Just now',
      upvotes: 0,
      isAccepted: false,
      attachments: []
    };
    
    setQuestions(
      questions.map(q =>
        q.id === qid
          ? { ...q, answers: [...q.answers, newAnswer] }
          : q
      )
    );
    setAnswer({ ...answer, [qid]: '' });
  };

  const handleUpvote = (qid, aid = null) => {
    setQuestions(
      questions.map(q => {
        if (q.id === qid) {
          if (aid === null) {
            return { ...q, upvotes: q.upvotes + 1 };
          } else {
            return {
              ...q,
              answers: q.answers.map(a =>
                a.id === aid ? { ...a, upvotes: a.upvotes + 1 } : a
              )
            };
          }
        }
        return q;
      })
    );
  };

  const handleAcceptAnswer = (qid, aid) => {
    setQuestions(
      questions.map(q => {
        if (q.id === qid) {
          return {
            ...q,
            isResolved: true,
            answers: q.answers.map(a =>
              a.id === aid ? { ...a, isAccepted: true } : { ...a, isAccepted: false }
            )
          };
        }
        return q;
      })
    );
  };

  // Filter and sort questions
  const filteredQuestions = questions
    .filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.answers.some(a => a.answer.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return b.id - a.id;
      if (sortBy === 'popular') return b.upvotes - a.upvotes;
      if (sortBy === 'unanswered') return a.answers.length - b.answers.length;
      return 0;
    });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Peer Learning Hub</h2>
        
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
        </div>

        {/* Ask Question Form */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            <textarea
              name="question"
              value={newQ.question}
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
                disabled={!newQ.question}
                className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No questions found. Be the first to ask!
          </div>
        ) : (
          filteredQuestions.map(q => (
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
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        q.priority === 'Urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {q.priority}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {q.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{q.question}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {q.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {q.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        {q.answers.length} answers
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUpvote(q.id)}
                    className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp size={20} />
                    <span className="text-sm font-medium">{q.upvotes}</span>
                  </button>
                </div>

                {/* Answers */}
                {q.answers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {q.answers.map(a => (
                      <div key={a.id} className={`pl-4 border-l-2 ${
                        a.isAccepted ? 'border-green-500' : 'border-gray-200'
                      }`}>
                        <p className="text-gray-700 mb-2">{a.answer}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {a.author}
                            </span>
                            <span>{a.timestamp}</span>
                            {a.isAccepted && (
                              <span className="text-green-600 font-medium">✓ Accepted Answer</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!q.isResolved && (
                              <button
                                onClick={() => handleAcceptAnswer(q.id, a.id)}
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
                              <span className="text-sm">{a.upvotes}</span>
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
                    />
                    <button
                      type="button"
                      onClick={() => handleAnswerSubmit(q.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
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

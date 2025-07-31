
import React, { useState } from 'react';
import { MessageCircle, Send, User, Heart, MessageSquare, Star, ThumbsUp, Clock } from 'lucide-react';

const mockFeedbacks = [
  { 
    id: 1, 
    user: 'Sarah Johnson', 
    content: 'The course material is excellent! The explanations are clear and the examples really help understand complex concepts. I especially appreciate the practical assignments.', 
    comments: ['I completely agree! The hands-on approach makes learning so much easier.', 'Yes, the real-world examples are fantastic.'],
    timestamp: '2 hours ago',
    likes: 12,
    avatar: 'SJ'
  },
  { 
    id: 2, 
    user: 'Michael Chen', 
    content: 'Can we have more interactive sessions during lectures? Sometimes it gets difficult to follow when it\'s just one-way communication. Maybe some Q&A sessions would help.', 
    comments: ['Great suggestion! Interactive sessions would be amazing.'],
    timestamp: '5 hours ago',
    likes: 8,
    avatar: 'MC'
  },
  { 
    id: 3, 
    user: 'Emily Rodriguez', 
    content: 'The online resources are comprehensive, but I think we could benefit from more video tutorials for the programming assignments. Visual learning really helps!', 
    comments: [],
    timestamp: '1 day ago',
    likes: 15,
    avatar: 'ER'
  }
];

const FeedbackForum = () => {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
  const [newFeedback, setNewFeedback] = useState('');
  const [comment, setComment] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;
    
    setFeedbacks([
      {
        id: feedbacks.length + 1,
        user: 'You',
        content: newFeedback,
        comments: [],
        timestamp: 'Just now',
        likes: 0,
        avatar: 'YU'
      },
      ...feedbacks
    ]);
    setNewFeedback('');
  };

  const handleCommentChange = (id, value) => {
    setComment({ ...comment, [id]: value });
  };

  const handleCommentSubmit = (id) => {
    if (!comment[id]?.trim()) return;
    
    setFeedbacks(
      feedbacks.map(f =>
        f.id === id ? { ...f, comments: [...f.comments, comment[id]] } : f
      )
    );
    setComment({ ...comment, [id]: '' });
  };

  const handleLike = (id) => {
    const newLikedPosts = new Set(likedPosts);
    const isLiked = likedPosts.has(id);
    
    if (isLiked) {
      newLikedPosts.delete(id);
    } else {
      newLikedPosts.add(id);
    }
    
    setLikedPosts(newLikedPosts);
    
    setFeedbacks(
      feedbacks.map(f =>
        f.id === id ? { 
          ...f, 
          likes: isLiked ? f.likes - 1 : f.likes + 1 
        } : f
      )
    );
  };

  const getAvatarColor = (avatar) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600'
    ];
    return colors[avatar.charCodeAt(0) % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Feedback Forum</h2>
          <p className="text-[#696E79] font-medium">Share your thoughts and connect with fellow students</p>
        </div>
      </div>

      {/* Post New Feedback */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#132D46] to-[#191E29] px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Share Your Feedback</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">YU</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or feedback about the course..."
                rows="4"
                className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
              />
              <button
                onClick={handleFeedbackSubmit}
                className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Post Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Posts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#132D46] flex items-center space-x-2">
            <Star className="w-5 h-5 text-[#2CC295]" />
            <span>Community Feedback</span>
            <span className="bg-[#2CC295]/20 text-[#2CC295] px-3 py-1 rounded-full text-sm font-semibold">
              {feedbacks.length}
            </span>
          </h3>
        </div>

        {feedbacks.map(feedback => (
          <div key={feedback.id} className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Post Header */}
            <div className="p-6 border-b border-[#191E29]/10">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${getAvatarColor(feedback.avatar)} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{feedback.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#132D46] text-lg">{feedback.user}</h4>
                    <span className="text-[#696E79] text-sm font-medium flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{feedback.timestamp}</span>
                    </span>
                  </div>
                  <p className="text-[#132D46] font-medium mt-3 leading-relaxed">{feedback.content}</p>
                </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] border-b border-[#191E29]/10">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(feedback.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    likedPosts.has(feedback.id)
                      ? 'bg-[#2CC295] text-white shadow-lg'
                      : 'bg-white text-[#132D46] hover:bg-[#2CC295]/10 border border-[#191E29]/10'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{feedback.likes}</span>
                </button>
                <div className="flex items-center space-x-2 text-[#696E79] font-medium">
                  <MessageSquare className="w-4 h-4" />
                  <span>{feedback.comments.length} comments</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {feedback.comments.length > 0 && (
              <div className="px-6 py-4 space-y-4 bg-[#F8FFFE]/50">
                {feedback.comments.map((commentText, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#696E79] to-[#132D46] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 border border-[#191E29]/10 flex-1">
                      <p className="text-[#132D46] font-medium text-sm">{commentText}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="p-6">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 flex space-x-3">
                  <input
                    value={comment[feedback.id] || ''}
                    onChange={(e) => handleCommentChange(feedback.id, e.target.value)}
                    placeholder="Add a thoughtful comment..."
                    className="flex-1 border-2 border-[#191E29]/20 rounded-xl px-4 py-2 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                  />
                  <button
                    onClick={() => handleCommentSubmit(feedback.id)}
                    className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {feedbacks.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#F8FFFE] rounded-2xl p-8 border border-[#2CC295]/20">
              <MessageCircle className="w-12 h-12 text-[#696E79] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#132D46] mb-2">No feedback yet</h3>
              <p className="text-[#696E79] font-medium">Be the first to share your thoughts about the course!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForum;

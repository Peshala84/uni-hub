import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContexts';

const mockFeedbacks = [
    { id: 1, user: 'Student1', content: 'Great course material!', comments: ['Agreed!'] },
    { id: 2, user: 'Student2', content: 'Can we have more examples in lectures?', comments: [] }
];

const FeedbackForum = () => {
    const { isLoggedIn } = useAuth();
    const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
    const [newFeedback, setNewFeedback] = useState('');
    const [comment, setComment] = useState({});

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (!isLoggedIn || !newFeedback) return;
        setFeedbacks([
            ...feedbacks,
            { id: feedbacks.length + 1, user: 'You', content: newFeedback, comments: [] }
        ]);
        setNewFeedback('');
    };

    const handleCommentChange = (id, value) => {
        setComment({ ...comment, [id]: value });
    };

    const handleCommentSubmit = (id) => {
        if (!isLoggedIn || !comment[id]) return;
        setFeedbacks(
            feedbacks.map(f =>
                f.id === id ? { ...f, comments: [...f.comments, comment[id]] } : f
            )
        );
        setComment({ ...comment, [id]: '' });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Feedback Forum</h2>
            <form onSubmit={handleFeedbackSubmit} className="mb-6 flex gap-2 flex-wrap">
                <input value={newFeedback} onChange={e => setNewFeedback(e.target.value)} required placeholder="Your feedback..." className="flex-1 border rounded px-2 py-1" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Post</button>
            </form>
            <div className="space-y-4">
                {feedbacks.map(f => (
                    <div key={f.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="font-semibold text-gray-800 mb-1">{f.user}</div>
                        <div className="text-gray-600 text-sm mb-2">{f.content}</div>
                        <div className="ml-4 space-y-1">
                            {f.comments.map((c, i) => (
                                <div key={i} className="text-xs text-gray-500">Comment: {c}</div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                value={comment[f.id] || ''}
                                onChange={e => handleCommentChange(f.id, e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 border rounded px-2 py-1"
                            />
                            <button type="button" onClick={() => handleCommentSubmit(f.id)} className="bg-green-600 text-white px-4 py-1 rounded">Comment</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackForum;

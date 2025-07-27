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
        <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
            <h2 className="text-2xl font-extrabold mb-6 text-[#191E29] tracking-tight">Feedback Forum</h2>
            <form onSubmit={handleFeedbackSubmit} className="mb-8 flex flex-col md:flex-row gap-3 md:gap-4">
                <input value={newFeedback} onChange={e => setNewFeedback(e.target.value)} required placeholder="Your feedback..." className="flex-1 border-2 border-[#2CC295] rounded-lg px-3 py-2 bg-white text-[#191E29] font-medium focus:ring-2 focus:ring-[#2CC295]" />
                <button type="submit" className="bg-[#2CC295] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#191E29] transition-colors">Post</button>
            </form>
            <div className="space-y-6">
                {feedbacks.map(f => (
                    <div key={f.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-semibold text-[#191E29] mb-1 text-lg">{f.user}</div>
                        <div className="text-[#696E79] text-sm mb-2">{f.content}</div>
                        <div className="ml-4 space-y-1">
                            {f.comments.map((c, i) => (
                                <div key={i} className="text-xs text-[#2CC295]">Comment: {c}</div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                value={comment[f.id] || ''}
                                onChange={e => handleCommentChange(f.id, e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 border-2 border-[#2CC295] rounded-lg px-3 py-2 bg-white text-[#191E29] font-medium focus:ring-2 focus:ring-[#2CC295]"
                            />
                            <button type="button" onClick={() => handleCommentSubmit(f.id)} className="bg-[#2CC295] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#191E29] transition-colors">Comment</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackForum;

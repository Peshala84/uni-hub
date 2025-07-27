import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContexts';

const mockQueries = [
    {
        id: 1,
        category: 'Assignment',
        ticket: 'Urgent',
        status: 'Open',
        question: 'When is the assignment 2 deadline?',
        response: 'Assignment 2 is due on August 10th.',
        feedback: null
    },
    {
        id: 2,
        category: 'Exams',
        ticket: 'Normal',
        status: 'Resolved',
        question: 'Will the exam be open book?',
        response: 'No, the exam is closed book.',
        feedback: '😊'
    }
];

const satisfactionEmojis = ['😡', '😕', '😐', '😊', '😍'];

const StudentQueries = () => {
    const { isLoggedIn } = useAuth();
    const [queries, setQueries] = useState(mockQueries);
    const [newQuery, setNewQuery] = useState({ category: '', ticket: '', question: '' });
    const [selectedFeedback, setSelectedFeedback] = useState({});

    const handleInputChange = (e) => {
        setNewQuery({ ...newQuery, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLoggedIn) return;
        setQueries([
            ...queries,
            {
                id: queries.length + 1,
                ...newQuery,
                status: 'Open',
                response: '',
                feedback: null
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

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Queries</h2>
            <form onSubmit={handleSubmit} className="mb-6 space-y-2">
                <div className="flex gap-2">
                    <select name="category" value={newQuery.category} onChange={handleInputChange} required className="border rounded px-2 py-1">
                        <option value="">Category</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Exams">Exams</option>
                        <option value="Lecture Content">Lecture Content</option>
                    </select>
                    <select name="ticket" value={newQuery.ticket} onChange={handleInputChange} required className="border rounded px-2 py-1">
                        <option value="">Ticket</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Normal">Normal</option>
                    </select>
                    <input name="question" value={newQuery.question} onChange={handleInputChange} required placeholder="Your query..." className="flex-1 border rounded px-2 py-1" />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Submit</button>
                </div>
            </form>
            <div className="space-y-4">
                {queries.map(q => (
                    <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{q.category}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${q.ticket === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{q.ticket}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${q.status === 'Open' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{q.status}</span>
                        </div>
                        <div className="font-semibold text-gray-800 mb-1">{q.question}</div>
                        {q.response && <div className="text-gray-600 text-sm mb-1">Lecturer: {q.response}</div>}
                        {q.status === 'Resolved' && (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs">Feedback:</span>
                                {satisfactionEmojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        className={`text-xl ${q.feedback === emoji ? 'ring-2 ring-blue-400' : ''}`}
                                        onClick={() => handleFeedback(q.id, emoji)}
                                        disabled={!!q.feedback}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                                {q.feedback && <span className="ml-2">Thank you!</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentQueries;

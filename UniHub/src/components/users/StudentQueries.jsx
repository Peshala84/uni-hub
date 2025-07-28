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
        <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
            <h2 className="text-2xl font-extrabold mb-6 text-[#191E29] tracking-tight">Student Queries</h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <select name="category" value={newQuery.category} onChange={handleInputChange} required className="border-2 border-[#2CC295] rounded-lg px-3 py-2 bg-white text-[#132D46] font-semibold focus:ring-2 focus:ring-[#2CC295]">
                        <option value="">Category</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Exams">Exams</option>
                        <option value="Lecture Content">Lecture Content</option>
                    </select>
                    <select name="ticket" value={newQuery.ticket} onChange={handleInputChange} required className="border-2 border-[#2CC295] rounded-lg px-3 py-2 bg-white text-[#132D46] font-semibold focus:ring-2 focus:ring-[#2CC295]">
                        <option value="">Ticket</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Normal">Normal</option>
                    </select>
                    <input name="question" value={newQuery.question} onChange={handleInputChange} required placeholder="Your query..." className="flex-1 border-2 border-[#2CC295] rounded-lg px-3 py-2 bg-white text-[#191E29] font-medium focus:ring-2 focus:ring-[#2CC295]" />
                    <button type="submit" className="bg-[#2CC295] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#191E29] transition-colors">Submit</button>
                </div>
            </form>
            <div className="space-y-6">
                {queries.map(q => (
                    <div key={q.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-[#2CC295]/10 text-[#2CC295] px-3 py-1 rounded-full font-bold uppercase tracking-wide">{q.category}</span>
                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${q.ticket === 'Urgent' ? 'bg-[#191E29]/10 text-[#191E29]' : 'bg-[#696E79]/10 text-[#696E79]'}`}>{q.ticket}</span>
                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${q.status === 'Open' ? 'bg-[#132D46]/10 text-[#132D46]' : 'bg-[#2CC295]/10 text-[#2CC295]'}`}>{q.status}</span>
                        </div>
                        <div className="font-semibold text-[#191E29] mb-1 text-lg">{q.question}</div>
                        {q.response && <div className="text-[#132D46] text-sm mb-1">Lecturer: {q.response}</div>}
                        {q.status === 'Resolved' && (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-[#696E79]">Feedback:</span>
                                {satisfactionEmojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        className={`text-xl transition-all ${q.feedback === emoji ? 'ring-2 ring-[#2CC295] scale-110' : ''}`}
                                        onClick={() => handleFeedback(q.id, emoji)}
                                        disabled={!!q.feedback}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                                {q.feedback && <span className="ml-2 text-[#2CC295] font-bold">Thank you!</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentQueries;

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContexts';

const mockQuestions = [
    {
        id: 1,
        question: 'How to solve question 3 in assignment 2?',
        priority: 'Urgent',
        attachments: [],
        answers: [
            { id: 1, answer: 'Refer to lecture notes week 4.', attachments: [] }
        ]
    }
];

const PeerLearning = () => {
    const { isLoggedIn } = useAuth();
    const [questions, setQuestions] = useState(mockQuestions);
    const [newQ, setNewQ] = useState({ question: '', priority: 'Normal', attachments: [] });
    const [answer, setAnswer] = useState({});

    const handleQChange = (e) => {
        setNewQ({ ...newQ, [e.target.name]: e.target.value });
    };

    const handleQSubmit = (e) => {
        e.preventDefault();
        if (!isLoggedIn) return;
        setQuestions([
            ...questions,
            { id: questions.length + 1, ...newQ, answers: [] }
        ]);
        setNewQ({ question: '', priority: 'Normal', attachments: [] });
    };

    const handleAnswerChange = (id, value) => {
        setAnswer({ ...answer, [id]: value });
    };

    const handleAnswerSubmit = (qid) => {
        if (!isLoggedIn || !answer[qid]) return;
        setQuestions(
            questions.map(q =>
                q.id === qid
                    ? { ...q, answers: [...q.answers, { id: q.answers.length + 1, answer: answer[qid], attachments: [] }] }
                    : q
            )
        );
        setAnswer({ ...answer, [qid]: '' });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Peer Learning (Q&A)</h2>
            <form onSubmit={handleQSubmit} className="mb-6 flex gap-2 flex-wrap">
                <input name="question" value={newQ.question} onChange={handleQChange} required placeholder="Ask a question..." className="flex-1 border rounded px-2 py-1" />
                <select name="priority" value={newQ.priority} onChange={handleQChange} className="border rounded px-2 py-1">
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Post</button>
            </form>
            <div className="space-y-4">
                {questions.map(q => (
                    <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${q.priority === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{q.priority}</span>
                        </div>
                        <div className="font-semibold text-gray-800 mb-1">{q.question}</div>
                        <div className="ml-4 space-y-1">
                            {q.answers.map(a => (
                                <div key={a.id} className="text-gray-600 text-sm">Answer: {a.answer}</div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                value={answer[q.id] || ''}
                                onChange={e => handleAnswerChange(q.id, e.target.value)}
                                placeholder="Your answer..."
                                className="flex-1 border rounded px-2 py-1"
                            />
                            <button type="button" onClick={() => handleAnswerSubmit(q.id)} className="bg-green-600 text-white px-4 py-1 rounded">Answer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PeerLearning;

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContexts';

const mockResources = [
    { id: 1, title: 'Lecture 1 Slides', url: '#', type: 'PDF', sharedBy: 'Dr. Smith' },
    { id: 2, title: 'Assignment 2 Instructions', url: '#', type: 'DOCX', sharedBy: 'Prof. Lee' }
];

const Resources = () => {
    const { isLoggedIn } = useAuth();
    const [resources] = useState(mockResources);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resources Shared by Lecturers</h2>
            <div className="space-y-4">
                {resources.map(r => (
                    <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-gray-800">{r.title}</div>
                            <div className="text-gray-600 text-sm">Type: {r.type} | Shared by: {r.sharedBy}</div>
                        </div>
                        <a href={r.url} className="bg-blue-600 text-white px-4 py-1 rounded" download>Download</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;

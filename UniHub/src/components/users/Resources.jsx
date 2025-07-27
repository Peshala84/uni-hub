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
        <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
            <h2 className="text-2xl font-extrabold mb-6 text-[#191E29] tracking-tight">Resources Shared by Lecturers</h2>
            <div className="space-y-6">
                {resources.map(r => (
                    <div key={r.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="font-semibold text-[#191E29] text-lg">{r.title}</div>
                            <div className="text-[#696E79] text-sm">Type: {r.type} | Shared by: {r.sharedBy}</div>
                        </div>
                        <a href={r.url} className="bg-[#2CC295] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#191E29] transition-colors" download>Download</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;

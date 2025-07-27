import React, { useState } from 'react';
import StudentQueries from './StudentQueries';
import Resources from './Resources';
import FeedbackForum from './FeedbackForum';
import { BookOpen, HelpCircle, BookMarked, Star } from 'lucide-react';

const tabs = [
    { id: 'queries', label: 'Student Queries', icon: HelpCircle, color: 'text-orange-600' },
    { id: 'resources', label: 'Resources', icon: BookMarked, color: 'text-purple-600' },
    { id: 'feedback', label: 'Feedback Forum', icon: Star, color: 'text-yellow-600' }
];

const StudentCourses = () => {
    const [activeTab, setActiveTab] = useState('queries');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'queries':
                return <StudentQueries />;
            case 'resources':
                return <Resources />;
            case 'feedback':
                return <FeedbackForum />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
            <div className="flex space-x-4 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors focus:outline-none ${activeTab === tab.id ? `${tab.color} bg-gray-100 border-${tab.color.split('-')[1]}-300` : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div>{renderTabContent()}</div>
        </div>
    );
};

export default StudentCourses;

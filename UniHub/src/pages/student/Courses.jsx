
import React, { useState } from 'react';
import StudentQueries from './StudentQueries';
import Resources from './Resources';
import FeedbackForum from './FeedbackForum';
import { BookOpen, HelpCircle, BookMarked, Star, GraduationCap } from 'lucide-react';

const tabs = [
    { id: 'queries', label: 'Student Queries', icon: HelpCircle, color: 'text-orange-500' },
    { id: 'resources', label: 'Resources', icon: BookMarked, color: 'text-blue-500' },
    { id: 'feedback', label: 'Feedback Forum', icon: Star, color: 'text-yellow-500' }
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
        <div className="min-h-screen bg-gradient-to-br from-[#F8FFFE] via-[#FFFFFF] to-[#F0FFF4] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#132D46] to-[#191E29] rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2CC295]/10 to-transparent"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                        <div className="bg-[#2CC295] p-4 rounded-2xl shadow-lg">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Learning Hub</h1>
                            <p className="text-[#FFFFFF]/80 text-lg font-medium">Explore courses, connect with peers, and enhance your learning journey</p>
                        </div>
                    </div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2CC295]/20 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#2CC295]/10 rounded-full blur-3xl"></div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-[#191E29]/5 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-8 py-6 border-b border-[#191E29]/10">
                        <div className="flex space-x-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2CC295]/20
                                    ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white shadow-lg shadow-[#2CC295]/30'
                                            : 'bg-white text-[#132D46] hover:bg-[#2CC295]/5 hover:text-[#2CC295] shadow-md border border-[#191E29]/10'}
                                    `}
                                >
                                    <div className={`p-1 rounded-lg transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-white/20'
                                            : 'bg-[#2CC295]/10 group-hover:bg-[#2CC295]/20'
                                        }`}>
                                        <tab.icon className={`w-4 h-4 transition-colors duration-300 ${activeTab === tab.id
                                                ? 'text-white'
                                                : 'text-[#2CC295]'
                                            }`} />
                                    </div>
                                    <span className="font-semibold tracking-wide">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        <div className="bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-2xl border border-[#2CC295]/20 p-8 min-h-[500px] relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2CC295]/10 to-transparent rounded-full blur-xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#132D46]/5 to-transparent rounded-full blur-2xl"></div>

                            {/* Content wrapper */}
                            <div className="relative z-10">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats or Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#132D46] text-lg">Active Courses</h3>
                                <p className="text-[#696E79] font-medium">5 Enrolled</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-[#132D46] to-[#191E29] p-3 rounded-xl">
                                <HelpCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#132D46] text-lg">Open Queries</h3>
                                <p className="text-[#696E79] font-medium">3 Pending</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-[#696E79] to-[#132D46] p-3 rounded-xl">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#132D46] text-lg">Achievements</h3>
                                <p className="text-[#696E79] font-medium">12 Earned</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating action elements for visual appeal */}
            <div className="fixed top-20 right-10 w-4 h-4 bg-[#2CC295]/30 rounded-full animate-pulse"></div>
            <div className="fixed bottom-32 left-10 w-6 h-6 bg-[#132D46]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
    );
};

export default StudentCourses;

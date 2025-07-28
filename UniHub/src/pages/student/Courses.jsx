import { GraduationCap, BookOpen, HelpCircle, Star } from 'lucide-react';




import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentQueries from './StudentQueries';
import Resources from './Resources';
import FeedbackForum from './FeedbackForum';

const mockCourses = [
    { id: 'cs101', name: 'CS101 - Introduction to Computer Science' },
    { id: 'math201', name: 'MATH201 - Calculus II' },
    { id: 'phy110', name: 'PHY110 - Physics Fundamentals' }
];

const StudentCourses = () => {
    const [selectedCourse, setSelectedCourse] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('queries');
    const navigate = useNavigate();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'queries':
                return <StudentQueries courseId={selectedCourse} />;
            case 'resources':
                return <Resources courseId={selectedCourse} />;
            case 'feedback':
                return <FeedbackForum courseId={selectedCourse} />;
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

                {/* Course Selection */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold text-[#132D46] mb-2">Select a Course</label>
                    <select
                        value={selectedCourse}
                        onChange={e => setSelectedCourse(e.target.value)}
                        className="w-full md:w-1/2 border-2 border-[#2CC295]/30 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                    >
                        <option value="">-- Choose a course --</option>
                        {mockCourses.map(course => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </select>
                </div>

                {/* Show navigation and tabs only if a course is selected */}
                {selectedCourse && (
                    <>
                        {/* Navigation Buttons */}
                        <div className="flex space-x-2 mb-6">
                            <button
                                className={`px-4 py-2 rounded-xl font-semibold text-sm border border-[#2CC295]/30 transition ${activeTab === 'queries' ? 'bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white shadow-lg' : 'bg-white text-[#2CC295] hover:bg-[#2CC295]/10'}`}
                                onClick={() => setActiveTab('queries')}
                            >Queries</button>
                            <button
                                className={`px-4 py-2 rounded-xl font-semibold text-sm border border-[#2CC295]/30 transition ${activeTab === 'resources' ? 'bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white shadow-lg' : 'bg-white text-[#2CC295] hover:bg-[#2CC295]/10'}`}
                                onClick={() => setActiveTab('resources')}
                            >Resources</button>
                            <button
                                className={`px-4 py-2 rounded-xl font-semibold text-sm border border-[#2CC295]/30 transition ${activeTab === 'feedback' ? 'bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white shadow-lg' : 'bg-white text-[#2CC295] hover:bg-[#2CC295]/10'}`}
                                onClick={() => setActiveTab('feedback')}
                            >Feedback Forum</button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8 bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-2xl border border-[#2CC295]/20 min-h-[500px] relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2CC295]/10 to-transparent rounded-full blur-xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#132D46]/5 to-transparent rounded-full blur-2xl"></div>
                            {/* Content wrapper */}
                            <div className="relative z-10">
                                {renderTabContent()}
                            </div>
                        </div>
                    </>
                )}

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

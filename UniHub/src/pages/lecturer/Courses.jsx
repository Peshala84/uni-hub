import React, { useState } from 'react';
import { BookOpen, Plus, MessageSquare, Star, FileText, BookMarked, Users, HelpCircle } from 'lucide-react';
import Queries from '../../components/users/Queries';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showForm, setShowForm] = useState(false);

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: MessageSquare, color: 'text-blue-600' },
    { id: 'assignments', label: 'Assignments', icon: FileText, color: 'text-green-600' },
    { id: 'resources', label: 'Learning Resources', icon: BookMarked, color: 'text-purple-600' },
    { id: 'queries', label: 'Student Queries', icon: HelpCircle, color: 'text-orange-600' },
    { id: 'feedback', label: 'Feedback', icon: Star, color: 'text-yellow-600' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'announcements':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Course Announcements</h3>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Announcement</span>
              </button>
            </div>
            
            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Create New Announcement</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Content</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter announcement content"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                      Publish
                    </button>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-800">Week {item} Assignment Due</h4>
                  <p className="mb-2 text-sm text-gray-600">Complete the programming exercises for Chapter {item}.</p>
                  <span className="text-xs text-gray-500">Posted 2 days ago</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Assignments</h3>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Assignment</span>
              </button>
            </div>
            
            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Create New Assignment</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Assignment Title</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter assignment title"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Due Date</label>
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Instructions</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter assignment instructions"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
                      Create Assignment
                    </button>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-800">Assignment {item}</h4>
                  <p className="mb-3 text-sm text-gray-600">Due: Jan {15 + item}, 2024</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                      {item % 2 === 0 ? 'Active' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-500">{20 - item * 2} submissions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Learning Resources</h3>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Resource</span>
              </button>
            </div>
            
            {showForm && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h4 className="mb-4 font-medium text-gray-800">Add Learning Resource</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Resource Title</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter resource title"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option>PDF Document</option>
                        <option>Video Lecture</option>
                        <option>External Link</option>
                        <option>Presentation</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter resource description"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                      Add Resource
                    </button>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { title: 'Algorithm Analysis Notes', type: 'PDF', size: '2.5 MB' },
                { title: 'Data Structures Video Series', type: 'Video', duration: '45 min' },
                { title: 'Programming Best Practices', type: 'Link', domain: 'external' },
                { title: 'Midterm Study Guide', type: 'PDF', size: '1.8 MB' }
              ].map((resource, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-800">{resource.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                      {resource.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {resource.size || resource.duration || resource.domain}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'queries':
        return <Queries />;

      case 'feedback':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Student Feedback</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { rating: 4.5, comment: 'Great explanation of complex topics', student: 'Anonymous', course: 'CS301' },
                { rating: 5.0, comment: 'Very helpful office hours', student: 'Student A', course: 'CS202' },
                { rating: 4.2, comment: 'Assignments are challenging but fair', student: 'Anonymous', course: 'CS301' }
              ].map((feedback, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(feedback.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {feedback.rating}
                      </span>
                    </div>
                    <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
                      {feedback.course}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">"{feedback.comment}"</p>
                  <p className="text-xs text-gray-500">- {feedback.student}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4 space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          </div>
          <p className="text-gray-600">
            Manage your courses, assignments, and interact with students efficiently.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowForm(false);
                  }}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? `border-blue-500 ${tab.color} bg-blue-50`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Courses;
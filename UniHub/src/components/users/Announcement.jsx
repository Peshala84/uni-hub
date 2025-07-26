import React, { useState } from 'react';
import { Calendar, User, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';
import { useNavigate } from 'react-router-dom';

const mockAnnouncements = [
  {
    id: 1,
    title: 'Mid-term Examination Schedule Released',
    content: 'The mid-term examination schedule for Fall 2024 has been published. Please check your course portals for specific dates and venues. All students are required to carry their university ID cards during examinations. Late arrivals will not be accommodated beyond 30 minutes of the scheduled start time.',
    date: '2024-01-15',
    author: 'Academic Office',
    priority: 'high',
    category: 'Academic'
  },
  {
    id: 2,
    title: 'Library Extended Hours During Finals',
    content: 'The university library will extend its operating hours during the final examination period. New hours: Monday-Friday 7:00 AM - 12:00 AM, Saturday-Sunday 9:00 AM - 10:00 PM. Additional study spaces have been arranged in the student center.',
    date: '2024-01-12',
    author: 'Library Services',
    priority: 'medium',
    category: 'Facilities'
  },
  {
    id: 3,
    title: 'Research Grant Application Deadline',
    content: 'Faculty members interested in applying for the Spring 2024 research grants must submit their applications by February 1st, 2024. All required documents and proposal guidelines are available on the faculty portal. Contact the research office for assistance.',
    date: '2024-01-10',
    author: 'Research Office',
    priority: 'high',
    category: 'Research'
  },
  {
    id: 4,
    title: 'Campus Wi-Fi Maintenance Scheduled',
    content: 'Routine maintenance of the campus network infrastructure will take place this weekend. Users may experience intermittent connectivity issues between 2:00 AM - 6:00 AM on Saturday and Sunday. Please plan accordingly.',
    date: '2024-01-08',
    author: 'IT Services',
    priority: 'low',
    category: 'Technical'
  }
];

const Announcement = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleAnnouncementClick = (announcement) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setSelectedAnnouncement(announcement);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Latest Announcements</h2>
        {!isLoggedIn && (
          <p className="text-sm text-gray-500">Click any item to login and view details</p>
        )}
      </div>

      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            onClick={() => handleAnnouncementClick(announcement)}
            className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {announcement.category}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                  {announcement.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {isLoggedIn ? announcement.content.substring(0, 120) + '...' : 'Login to view full content...'}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{announcement.author}</span>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Announcement Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                    {selectedAnnouncement.priority.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedAnnouncement.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedAnnouncement.title}
              </h2>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedAnnouncement.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{selectedAnnouncement.author}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedAnnouncement.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
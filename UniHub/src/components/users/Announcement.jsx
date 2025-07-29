import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, User, ChevronRight, X, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Announcement = () => {
  const { isLoggedIn, userRole } = useAuth();
  const navigate = useNavigate();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch site announcements from API
  useEffect(() => {
    const fetchSiteAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8086/api/v1/lecturer/site/announcements');
        setAnnouncements(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteAnnouncements();
  }, []);

  // Get announcements based on user role
  const getAnnouncementsForRole = () => {
    if (!isLoggedIn) {
      // Show limited announcements for non-logged-in users
      return announcements.slice(0, 3);
    }
    
    // Show all announcements for logged-in users
    // Sort by created_at date (newest first)
    return announcements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const filteredAnnouncements = getAnnouncementsForRole().filter(announcement => {
    if (selectedFilter === 'all') return true;
    // You can add category filtering logic here if categories are added to the backend
    return true;
  });

  const getUniqueCategories = () => {
    // For now, return empty array since categories aren't in the current API response
    // You can modify this when categories are added to the backend
    return [];
  };

  const handleAnnouncementClick = (announcement) => {
    if (!isLoggedIn) {
      navigate('/lecturer/login');
      return;
    }
    setSelectedAnnouncement(announcement);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Site Announcements
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isLoggedIn 
              ? 'Latest updates and important information'
              : 'Click any item to login and view details'
            }
          </p>
        </div>
        {!isLoggedIn && (
          <p className="text-sm text-gray-500">Click any item to login and view details</p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading announcements...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="mb-4 text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs (only show when logged in and has categories) */}
      {isLoggedIn && !loading && !error && getUniqueCategories().length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedFilter === 'all'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {getUniqueCategories().map(category => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedFilter === category
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Announcements List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-500">No announcements available at the moment.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.announcement_id}
                onClick={() => handleAnnouncementClick(announcement)}
                className="p-4 transition-all duration-200 border border-gray-200 rounded-lg cursor-pointer group hover:shadow-md hover:border-blue-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 space-x-3">
                      <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 border border-blue-200 rounded-full">
                        ANNOUNCEMENT
                      </span>
                      {announcement.date && (
                        <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                          {formatDate(announcement.date)}
                        </span>
                      )}
                      {announcement.time && (
                        <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                          {formatTime(announcement.time)}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="mb-2 font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                      {announcement.topic}
                    </h3>
                    
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {isLoggedIn 
                        ? (announcement.description?.length > 120 
                           ? announcement.description.substring(0, 120) + '...' 
                           : announcement.description)
                        : 'Login to view full content...'
                      }
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {announcement.created_at && (
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>Created: {formatDateTime(announcement.created_at)}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          ID: {announcement.announcement_id}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 ml-4 text-gray-400 transition-colors group-hover:text-blue-600" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detailed Announcement Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 border border-blue-200 rounded-full">
                    ANNOUNCEMENT
                  </span>
                  <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                    ID: {selectedAnnouncement.announcement_id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                {selectedAnnouncement.topic}
              </h2>
              
              <div className="grid grid-cols-1 gap-4 mb-6 text-sm text-gray-500 md:grid-cols-2">
                {selectedAnnouncement.date && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Date: {formatDate(selectedAnnouncement.date)}</span>
                  </div>
                )}
                {selectedAnnouncement.time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Time: {formatTime(selectedAnnouncement.time)}</span>
                  </div>
                )}
                {selectedAnnouncement.created_at && (
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <User className="w-4 h-4" />
                    <span>Created: {formatDateTime(selectedAnnouncement.created_at)}</span>
                  </div>
                )}
              </div>
              
              <div className="prose max-w-none">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Description</h3>
                <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                  {selectedAnnouncement.description}
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
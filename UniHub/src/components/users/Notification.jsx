import React, { useState, useEffect } from 'react';
import { Bell, Calendar, MessageSquare, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import axios from 'axios';

const Notification = ({ lecturerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Use default lecturer ID 1 until login is implemented
  const currentLecturerId = lecturerId || 1;

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching notifications for lecturer ID:', currentLecturerId);
        const response = await axios.get(`http://localhost:8086/api/v1/lecturer/${currentLecturerId}/notifications`);
        
        const data = response.data;
        
        // Transform API data to match component structure
        const transformedNotifications = data.map(notification => ({
          id: notification.notification_id,
          title: notification.message || 'Notification',
          message: notification.message,
          type: 'message', // Default type, you can modify based on your needs
          time: formatTime(notification.created_at || new Date()),
          read: notification.is_read || false,
          priority: 'medium' // Default priority, you can modify based on your needs
        }));
        
        setNotifications(transformedNotifications);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    // Always fetch notifications (will use default ID 1 if not provided)
    console.log('Starting to fetch notifications for lecturer ID:', currentLecturerId);
    fetchNotifications();
  }, [currentLecturerId]);

  // Helper function to format time
  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'reminder': return Calendar;
      case 'alert': return AlertCircle;
      case 'announcement': return Bell;
      default: return Bell;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'message': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'high': return notification.priority === 'high';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading notifications...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="ml-2 text-red-700">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex p-1 mb-6 space-x-1 bg-gray-100 rounded-lg">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    filter === tab.key 
                      ? 'bg-blue-100 text-green-800' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-4 overflow-y-auto max-h-96">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications to display</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-blue-50 border-r-4 border-r-blue-500' : 'bg-gray-50'
                    } rounded-lg p-4 transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1 space-x-4">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-1 space-x-2">
                            {/* <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3> */}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              ID: {notification.id}
                            </span>
                          </div>
                          
                          <p className="mb-2 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center ml-4 space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 transition-colors hover:text-green-600"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 transition-colors hover:text-red-600"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;
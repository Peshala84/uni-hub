import React, { useState } from 'react';
import { Bell, Calendar, MessageSquare, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    title: 'New Student Query Received',
    message: 'John Smith has submitted a question about Assignment 3. Please review and respond.',
    type: 'message',
    time: '2 hours ago',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Faculty Meeting Reminder',
    message: 'Department meeting scheduled for tomorrow at 10:00 AM in Conference Room A.',
    type: 'reminder',
    time: '1 day ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Assignment Submission Deadline',
    message: 'CS301 Assignment 2 submissions are due in 3 days. 15 students have not submitted yet.',
    type: 'alert',
    time: '2 days ago',
    read: true,
    priority: 'high'
  },
  {
    id: 4,
    title: 'Course Evaluation Results Available',
    message: 'Student feedback for Fall 2024 courses is now available in your dashboard.',
    type: 'announcement',
    time: '3 days ago',
    read: true,
    priority: 'low'
  },
  {
    id: 5,
    title: 'System Maintenance Notice',
    message: 'The learning management system will undergo maintenance this weekend from 2-6 AM.',
    type: 'announcement',
    time: '1 week ago',
    read: true,
    priority: 'medium'
  }
];

const Notification = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-blue-600" />
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
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
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
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                filter === tab.key 
                  ? 'bg-blue-100 text-blue-800' 
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
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="mb-2 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{notification.time}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.priority === 'high' 
                            ? 'bg-red-100 text-red-800'
                            : notification.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {notification.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4 space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 transition-colors hover:text-blue-600"
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
    </div>
  );
};

export default Notification;
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const mockEvents = [
  { id: 1, date: '2025-07-28', title: 'Faculty Meeting', type: 'meeting' },
  { id: 2, date: '2025-07-30', title: 'Research Presentation', type: 'academic' },
  { id: 3, date: '2025-08-02', title: 'Student Registration', type: 'deadline' },
  { id: 4, date: '2025-08-05', title: 'Semester Start', type: 'academic' },
  { id: 5, date: '2025-08-15', title: 'Project Submission', type: 'deadline' },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    return (
      day &&
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const hasEvent = (day) => {
    if (!day) return false;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.some(event => event.date === dateString);
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(event => event.date === dateString);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'academic': return 'bg-green-500';
      case 'deadline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-700 min-w-[200px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => day && setSelectedDate(day)}
            className={`
              relative p-2 h-12 text-center text-sm cursor-pointer rounded-lg transition-colors
              ${day ? 'hover:bg-blue-50' : ''}
              ${isToday(day) ? 'bg-blue-100 text-blue-800 font-bold' : ''}
              ${selectedDate === day ? 'bg-blue-200 text-blue-900' : ''}
              ${!day ? 'cursor-default' : ''}
            `}
          >
            {day && (
              <>
                <span className={isToday(day) ? 'font-bold' : ''}>{day}</span>
                {hasEvent(day) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Events for selected day */}
      {selectedDate && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">
            Events for {monthNames[currentMonth]} {selectedDate}, {currentYear}
          </h4>
          <div className="space-y-2">
            {getEventsForDay(selectedDate).length > 0 ? (
              getEventsForDay(selectedDate).map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                  <span className="text-sm text-gray-700">{event.title}</span>
                  <span className="text-xs text-gray-500 capitalize">({event.type})</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No events scheduled for this day.</p>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Upcoming Events</h4>
        <div className="space-y-2">
          {mockEvents.slice(0, 3).map(event => (
            <div key={event.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                <span className="text-sm text-gray-700">{event.title}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
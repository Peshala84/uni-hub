import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, RefreshCw, MessageSquare, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';
import axios from 'axios';

const Appointment = () => {
  const { userData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch pending appointments
  const fetchPendingAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use userData.id with fallback to 1 for development/testing
      const lecturerId = userData?.id || 1;
      
      console.log('Fetching pending appointments for lecturer ID:', lecturerId);
      
      const response = await axios.get(`http://localhost:8086/api/v1/lecturer/${lecturerId}/appointments/pending`);

      console.log('Response status:', response.status);
      console.log('Pending appointments data:', response.data);
      
      setAppointments(Array.isArray(response.data) ? response.data : []);
      
    } catch (err) {
      console.error('Error fetching pending appointments:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        setError(err.response.data?.message || err.response.data || 'Failed to fetch pending appointments');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Network error:', err.request);
        setError('Cannot connect to server. Please ensure the backend is running on port 8086.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', err.message);
        setError('An error occurred while fetching appointments');
      }
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Accept appointment
  const handleAcceptAppointment = async (appointment) => {
    // Get the appointment ID from various possible field names
    const appointmentId = appointment.id || appointment.appointmentId || appointment.appointment_id;
    
    if (!appointmentId) {
      console.error('No appointment ID found in appointment object:', appointment);
      setError('Unable to process appointment - missing ID');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [appointmentId]: 'accepting' }));
      setError('');
      setSuccessMessage('');
      
      const lecturerId = userData?.id || 1;
      
      console.log('Accepting appointment:', appointmentId, 'for lecturer:', lecturerId);
      console.log('Full appointment object:', appointment);
      
      const response = await axios.put(`http://localhost:8086/api/v1/lecturer/${lecturerId}/appointment/${appointmentId}/take`);

      console.log('Accept response status:', response.status);
      console.log('Updated appointment:', response.data);
      
      // Remove the accepted appointment from pending list
      setAppointments(prev => prev.filter(apt => (apt.id || apt.appointmentId || apt.appointment_id) !== appointmentId));
      setSuccessMessage('Appointment accepted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error accepting appointment:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Backend error response:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        
        // Try to parse error message
        let errorMessage = 'Failed to accept appointment';
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else {
            errorMessage = err.response.data.message || err.response.data.error || err.response.data.path || 'Failed to accept appointment';
          }
        }
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Network error:', err.request);
        setError('Cannot connect to server. Please ensure the backend is running on port 8086.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', err.message);
        setError('An error occurred while accepting the appointment');
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [appointmentId]: null }));
    }
  };

  // Reject appointment
  const handleRejectAppointment = async (appointment) => {
    // Get the appointment ID from various possible field names
    const appointmentId = appointment.id || appointment.appointmentId || appointment.appointment_id;
    
    if (!appointmentId) {
      console.error('No appointment ID found in appointment object:', appointment);
      setError('Unable to process appointment - missing ID');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [appointmentId]: 'rejecting' }));
      setError('');
      setSuccessMessage('');
      
      const lecturerId = userData?.id || 1;
      
      console.log('Rejecting appointment:', appointmentId, 'for lecturer:', lecturerId);
      console.log('Full appointment object:', appointment);
      
      // Make API call to reject appointment
      const response = await axios.put(`http://localhost:8086/api/v1/lecturer/${lecturerId}/appointment/${appointmentId}/reject`);

      console.log('Reject response status:', response.status);
      console.log('Updated appointment:', response.data);
      
      // Remove the rejected appointment from pending list
      setAppointments(prev => prev.filter(apt => (apt.id || apt.appointmentId || apt.appointment_id) !== appointmentId));
      setSuccessMessage('Appointment rejected successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Backend error response:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        
        // Try to parse error message
        let errorMessage = 'Failed to reject appointment';
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else {
            errorMessage = err.response.data.message || err.response.data.error || err.response.data.path || 'Failed to reject appointment';
          }
        }
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Network error:', err.request);
        setError('Cannot connect to server. Please ensure the backend is running on port 8086.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', err.message);
        setError('An error occurred while rejecting the appointment');
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [appointmentId]: null }));
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchPendingAppointments();
  }, [userData]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      // Handle both "HH:mm" and "HH:mm:ss" formats
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="p-6 mb-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#132D46]">Pending Appointments</h1>
                <p className="text-[#696E79] font-medium">Review and manage student appointment requests</p>
              </div>
            </div>
            <button
              onClick={fetchPendingAppointments}
              disabled={loading}
              className="flex items-center space-x-2 bg-[#132D46] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#132D46]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 mb-6 border border-green-200 bg-green-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-[#2CC295] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#696E79] font-medium">Loading pending appointments...</span>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {!loading && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                <div className="text-center">
                  <div className="bg-[#F8FFFE] rounded-2xl p-8 border border-[#2CC295]/20">
                    <Calendar className="w-12 h-12 text-[#696E79] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#132D46] mb-2">No Pending Appointments</h3>
                    <p className="text-[#696E79] font-medium">You have no pending appointment requests at the moment.</p>
                  </div>
                </div>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id || appointment.appointmentId || appointment.appointment_id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                  {/* Appointment Header */}
                  <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#2CC295]/20 p-2 rounded-lg">
                          <User className="w-5 h-5 text-[#2CC295]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#132D46]">
                            {appointment.studentName || appointment.student_name || 'Student'}
                          </h3>
                          <p className="text-sm text-[#696E79] font-medium">
                            {appointment.studentEmail || appointment.student_email || 'student@university.edu'}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                        Pending Review
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Date & Time */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-[#2CC295]" />
                          <div>
                            <p className="text-sm font-medium text-[#696E79]">Date</p>
                            <p className="text-[#132D46] font-semibold">
                              {formatDate(appointment.date || appointment.appointment_date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-[#2CC295]" />
                          <div>
                            <p className="text-sm font-medium text-[#696E79]">Time</p>
                            <p className="text-[#132D46] font-semibold">
                              {formatTime(appointment.time || appointment.appointment_time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason/Purpose */}
                    {(appointment.reason || appointment.purpose || appointment.description) && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-[#696E79] mb-2">Purpose/Reason</p>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-[#132D46] font-medium leading-relaxed">
                            {appointment.reason || appointment.purpose || appointment.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end pt-4 mt-6 space-x-3 border-t border-gray-200">
                      <button
                        onClick={() => handleRejectAppointment(appointment)}
                        disabled={actionLoading[appointment.id || appointment.appointmentId || appointment.appointment_id]}
                        className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-colors bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[appointment.id || appointment.appointmentId || appointment.appointment_id] === 'rejecting' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            <span>Rejecting...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleAcceptAppointment(appointment)}
                        disabled={actionLoading[appointment.id || appointment.appointmentId || appointment.appointment_id]}
                        className="flex items-center space-x-2 bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {actionLoading[appointment.id || appointment.appointmentId || appointment.appointment_id] === 'accepting' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            <span>Accepting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Info Section */}
        {!loading && appointments.length > 0 && (
          <div className="p-4 mt-6 border border-blue-200 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                You have {appointments.length} pending appointment{appointments.length !== 1 ? 's' : ''} requiring your attention.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
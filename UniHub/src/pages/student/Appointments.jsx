import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Search, Send, MapPin, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ lecturer: '', date: '', time: '', purpose: '', status: 'PENDING' });
    const [lecturerSearch, setLecturerSearch] = useState('');
    const [showLecturerDropdown, setShowLecturerDropdown] = useState(false);
    const [lecturersList, setLecturersList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [lecturerId, setLecturerId] = useState(null);
    const { studentId } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8086/api/v1/student/lecturers')
            .then(response => {
                setLecturersList(response.data);
                console.log('Lecturers fetched:', response.data);
            })
            .catch(error => {
                console.error('Error fetching lecturers:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8086/api/v1/student/appointments/${studentId}`)
            .then(response => {
                setAppointments(response.data);
                console.log('Appointments fetched:', response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }, [studentId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    // Synchronize input and lecturer search state and control dropdown visibility
    const handleLecturerSearch = (e) => {
        const value = e.target.value;
        setLecturerSearch(value);
        setForm({ ...form, lecturer: value, lecturerId: null });
        setShowLecturerDropdown(value.trim().length > 0);
    };


    // Filter lecturers by f_name or l_name, case insensitive
    const filteredLecturers = lecturersList.filter(lecturer => {
        const search = lecturerSearch.toLowerCase();
        return (lecturer.userDTO?.f_name?.toLowerCase().includes(search) || lecturer.userDTO?.l_name?.toLowerCase().includes(search));
    });

    // When selecting a lecturer from dropdown, set form and input state and hide dropdown
    const handleLecturerSelect = (lecturer) => {
        const fullName = `${lecturer.userDTO?.f_name} ${lecturer.userDTO?.l_name}`;
        setForm({ ...form, lecturerId: lecturer.lecturer_id, lecturer: fullName });
        setLecturerId(lecturer.lecturer_id);
        setForm(prev => ({ ...prev, lecturer: fullName }));
        setLecturerSearch(fullName);
        setShowLecturerDropdown(false);
    };

    const isFutureDate = (selectedDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight
        const date = new Date(selectedDate);
        return date > today;
    };

    const isTimeInRange = (time) => {
        // time expected in HH:mm or HH:mm:ss
        const [hour, minute] = time.split(':').map(Number);
        if (hour < 9 || hour > 16) return false;
        if (hour === 16 && minute > 0) return false;
        return true;
    };

    const getLecturerName = (lecturerId) => {
        const lecturer = lecturersList.find(l => l.lecturer_id === lecturerId);
        if (lecturer) {
            return `${lecturer.userDTO?.f_name} ${lecturer.userDTO?.l_name}`;
        }
        return 'Unknown Lecturer';
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.lecturerId) {
            alert('Please select a lecturer from the dropdown.');
            return;
        }
        if (!form.date) {
            alert('Please select a date.');
            return;
        }
        if (!isFutureDate(form.date)) {
            alert('Date must be in the future.');
            return;
        }
        if (!form.time) {
            alert('Please select a time.');
            return;
        }
        if (!isTimeInRange(form.time)) {
            alert('Time must be between 9:00 AM and 4:00 PM.');
            return;
        }
        if (!form.purpose || form.purpose.trim() === '') {
            alert('Please enter the purpose of your appointment.');
            return;
        }
        // Ensure time is in HH:mm:ss format:
        let timeWithSeconds = form.time;
        if (form.time.length === 5) { // e.g. "14:00"
            timeWithSeconds = form.time + ":00";
        }

        const payload = {
            student_id: Number(studentId),
            lecturer_id: form.lecturerId,
            date: form.date,
            time: timeWithSeconds,
            purpose: form.purpose,
            status: 'PENDING'
        };
        console.log('Submitting payload:', payload);

        axios.post('http://localhost:8086/api/v1/student/appointment', payload)
            .then(response => {
                console.log('Appointment booked:', response.data);
                setAppointments([...appointments, response.data]);
                setForm({ lecturerId: null, lecturer: '', date: '', time: '', purpose: '', status: 'PENDING' });
                setLecturerSearch('');
            })
            .catch(error => {
                console.error('Error booking appointment:', error.response?.data || error.message);
                alert('Failed to book appointment: ' + (error.response?.data?.message || error.message));
            });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        // Ensure time is in HH:mm:ss format:
        let timeWithSeconds = form.time;
        if (form.time.length === 5) { // e.g. "14:00"
            timeWithSeconds = form.time + ":00";
        }
        const payload = {
            appointment_id: form.appointment_id,
            student_id: Number(studentId),
            lecturer_id: form.lecturerId,
            date: form.date,
            time: timeWithSeconds,
            purpose: form.purpose,
            status: 'PENDING'
        };
        console.log('Updating payload:', payload);
        axios.put(`http://localhost:8086/api/v1/student/appointment`, payload)
            .then(response => {
                console.log('Appointment updated:', response.data);
                setAppointments(appointments.map(app => app.appointment_id === form.appointment_id ? response.data : app));
                setForm({ lecturerId: null, lecturer: '', date: '', time: '', purpose: '', status: 'PENDING' });
                setLecturerSearch('');
                alert('Appointment updated successfully');
                window.location.reload(); // Reload to reflect changes
            })
            .catch(error => {
                console.error('Error updating appointment:', error.response?.data || error.message);
                alert('Failed to update appointment: ' + (error.response?.data?.message || error.message));
            });
    };


    const handleEditClick = (appointment) => {
        setForm({
            appointment_id: appointment.appointment_id,
            lecturer_id: appointment.lecturer_id,
            lecturer: '', // or full name if you prefer
            date: appointment.date,
            time: appointment.time,
            purpose: appointment.purpose,
            status: appointment.status,
            appointment_id: appointment.appointment_id
        });
        setLecturerSearch('');
        setIsEditing(true);  // show the form
    };


    const handleDelete = (appointmentId) => {
        axios.delete(`http://localhost:8086/api/v1/student/appointments/${appointmentId}`)
            .then(response => {
                setAppointments(appointments.filter(app => app.appointment_id !== appointmentId));
                alert('Appointment deleted successfully');
            })
            .catch(error => {
                alert('Failed to delete appointment: ' + (error.response?.data?.message || error.message));
            });
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-gradient-to-r from-[#2CC295]/10 to-[#2CC295]/20 text-[#2CC295] border-[#2CC295]/30';
            case 'PENDING':
                return 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200';
            case 'REJECTED':
                return 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200';
            default:
                return 'bg-gradient-to-r from-[#696E79]/10 to-[#696E79]/20 text-[#696E79] border-[#696E79]/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="w-4 h-4" />;
            case 'PENDING':
                return <AlertCircle className="w-4 h-4" />;
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getAppointmentIcon = (status) => {
        return status === 'COMPLETED' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
            status === 'CONFIRMED' ? 'bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80' :
                'bg-gradient-to-br from-amber-500 to-amber-600';
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Appointments</h2>
                    <p className="text-[#696E79] font-medium">Schedule meetings with your instructors</p>
                </div>
            </div>

            {/* Book New Appointment */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[#132D46] to-[#191E29] px-6 py-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Book New Appointment</span>
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Lecturer Search */}
                        <div className="relative max-w-md">
                            <label className="text-sm font-semibold text-[#132D46]">Select Lecturer</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#696E79]" />
                                <input
                                    name="lecturer"
                                    type="text"
                                    value={lecturerSearch}
                                    onChange={handleLecturerSearch}
                                    onFocus={() => setShowLecturerDropdown(lecturerSearch.trim().length > 0)}
                                    placeholder="Search by first or last name..."
                                    className="w-full pl-10 pr-4 py-3 border-2 border-[#191E29]/20 rounded-xl text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                {showLecturerDropdown && filteredLecturers.length > 0 && (
                                    <div className="absolute z-20 bg-white border-2 border-[#2CC295]/20 w-full mt-2 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {filteredLecturers.map(lecturer => (
                                            <div
                                                key={`${lecturer.userDTO?.f_name}-${lecturer.userDTO?.l_name}`}
                                                className="px-4 py-3 hover:bg-[#2CC295]/5 cursor-pointer border-b border-[#191E29]/10 last:border-b-0"
                                                onMouseDown={e => e.preventDefault()} // Prevent input blur before click
                                                onClick={() => handleLecturerSelect(lecturer)}
                                            >
                                                <div className="font-semibold text-[#132D46]">{lecturer.userDTO?.f_name} {lecturer.userDTO?.l_name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {showLecturerDropdown && filteredLecturers.length === 0 && (
                                    <div className="absolute z-20 bg-white border-2 border-[#2CC295]/20 w-full mt-2 rounded-xl shadow-xl px-4 py-3 text-[#696E79]/80">
                                        No lecturers found
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Duration 
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#132D46]">Duration</label>
                            <select
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                            </select>
                        </div>*/}

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#132D46]">Date</label>
                            <input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                            />
                        </div>

                        {/* Time */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#132D46]">Time</label>
                            <input
                                name="time"
                                type="time"
                                value={form.time}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-semibold text-[#132D46]">Reason for Appointment</label>
                        <textarea
                            name="purpose"
                            value={form.purpose}
                            onChange={handleChange}
                            required
                            placeholder="Please describe the purpose of your appointment..."
                            rows="3"
                            className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
                        />
                    </div>

                    <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                        {/* all your inputs bound to form: lecturer, date, time, purpose */}
                        <button type="submit" className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-4 py-2 rounded font-semibold shadow">
                            {isEditing ? 'Update Appointment' : 'Request Appointment'}
                        </button>
                        {isEditing && (
                            <button type="button" className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-4 py-2 rounded font-semibold shadow" onClick={() => {
                                setIsEditing(false);
                                setForm({ lecturerId: null, lecturer: '', date: '', time: '', purpose: '', status: 'PENDING' });
                                setLecturerSearch('');
                            }}>
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#132D46] flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-[#2CC295]" />
                        <span>Your Appointments</span>
                        <span className="bg-[#2CC295]/20 text-[#2CC295] px-3 py-1 rounded-full text-sm font-semibold">
                            {appointments.length}
                        </span>
                    </h3>
                </div>

                {appointments.map(appointment => (
                    <div key={appointment.appointment_id} className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Appointment Header */}
                        <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`${getAppointmentIcon(appointment.status)} p-3 rounded-xl shadow-lg`}>
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#132D46] text-lg">{appointment.lecturer_id}</h4>
                                        <div className="flex items-center space-x-4 text-[#696E79] font-medium">
                                            <span className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{appointment.date}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{appointment.time}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(appointment.status)} flex items-center space-x-2`}>
                                    {getStatusIcon(appointment.status)}
                                    <span>{appointment.status}</span>
                                </span>
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="p-6 space-y-4">
                            <div className="bg-[#F8FFFE] rounded-xl p-4 border-l-4 border-[#2CC295]">
                                <h5 className="font-semibold text-[#132D46] mb-2 flex items-center space-x-2">
                                    <MessageSquare className="w-4 h-4 text-[#2CC295]" />
                                    <span>Meeting with</span>
                                    <h4 className="font-bold text-[#132D46] text-lg">{getLecturerName(appointment.lecturer_id)}</h4>
                                </h5>
                                
                            </div>
                            <div className="bg-[#F8FFFE] rounded-xl p-4 border-l-4 border-[#2CC295]">
                                <h5 className="font-semibold text-[#132D46] mb-2 flex items-center space-x-2">
                                    <MessageSquare className="w-4 h-4 text-[#2CC295]" />
                                    <span>Purpose:</span>
                                </h5>
                                <p className="text-[#132D46] font-medium">{appointment.purpose || appointment.reason}</p>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-[#191E29]/10">
                                    <div className="flex items-center space-x-2 text-[#696E79] font-medium mb-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick(appointment)}
                                            className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-4 py-2 rounded font-semibold shadow"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-[#132D46] font-semibold">{appointment.location}</p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-[#191E29]/10">
                                    <div className="flex items-center space-x-2 text-[#696E79] font-medium mb-1">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-red-600 transition-colors duration-200"
                                            disabled={appointment.status === 'APPROVED' || appointment.status === 'REJECTED'}
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this appointment?")) {
                                                    handleDelete(appointment.appointment_id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {appointments.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-[#F8FFFE] rounded-2xl p-8 border border-[#2CC295]/20">
                            <Calendar className="w-12 h-12 text-[#696E79] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-[#132D46] mb-2">No appointments scheduled</h3>
                            <p className="text-[#696E79] font-medium">Book your first appointment with an instructor!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;



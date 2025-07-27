import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Search, Send, MapPin, MessageSquare } from 'lucide-react';

const mockAppointments = [
    { 
        id: 1, 
        lecturer: 'Dr. Smith', 
        date: '2024-08-01', 
        time: '10:00', 
        reason: 'Discuss final project requirements and timeline', 
        status: 'Confirmed',
        location: 'Room 203, Engineering Building',
        duration: '30 minutes'
    },
    { 
        id: 2, 
        lecturer: 'Prof. Lee', 
        date: '2024-08-03', 
        time: '14:00', 
        reason: 'Need help with assignment 3 - data structures', 
        status: 'Pending',
        location: 'Room 156, Computer Science Building',
        duration: '45 minutes'
    },
    { 
        id: 3, 
        lecturer: 'Dr. Johnson', 
        date: '2024-07-28', 
        time: '09:30', 
        reason: 'Career guidance and research opportunities', 
        status: 'Completed',
        location: 'Room 301, Faculty Office',
        duration: '60 minutes'
    }
];

const lecturersList = [
    { name: 'Dr. Smith', department: 'Computer Science', expertise: 'Software Engineering' },
    { name: 'Prof. Lee', department: 'Computer Science', expertise: 'Data Structures & Algorithms' },
    { name: 'Dr. Johnson', department: 'Information Technology', expertise: 'Database Systems' },
    { name: 'Prof. Williams', department: 'Computer Science', expertise: 'Machine Learning' },
    { name: 'Dr. Brown', department: 'Information Systems', expertise: 'Cybersecurity' },
    { name: 'Prof. Miller', department: 'Software Engineering', expertise: 'Web Development' }
];

const Appointments = () => {
    const [appointments, setAppointments] = useState(mockAppointments);
    const [form, setForm] = useState({ lecturer: '', date: '', time: '', reason: '', duration: '30' });
    const [lecturerSearch, setLecturerSearch] = useState('');
    const [showLecturerDropdown, setShowLecturerDropdown] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLecturerSearch = (e) => {
        const value = e.target.value;
        setLecturerSearch(value);
        setForm({ ...form, lecturer: value });
        setShowLecturerDropdown(value.length > 0);
    };

    const filteredLecturers = lecturersList.filter(l =>
        l.name.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
        l.department.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
        l.expertise.toLowerCase().includes(lecturerSearch.toLowerCase())
    );

    const handleLecturerSelect = (lecturer) => {
        setForm({ ...form, lecturer: lecturer.name });
        setLecturerSearch(lecturer.name);
        setShowLecturerDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAppointments([
            ...appointments,
            { 
                id: appointments.length + 1, 
                ...form, 
                status: 'Pending',
                location: 'TBD',
                duration: form.duration + ' minutes'
            }
        ]);
        setForm({ lecturer: '', date: '', time: '', reason: '', duration: '30' });
        setLecturerSearch('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-gradient-to-r from-[#2CC295]/10 to-[#2CC295]/20 text-[#2CC295] border-[#2CC295]/30';
            case 'Pending':
                return 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200';
            case 'Completed':
                return 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200';
            default:
                return 'bg-gradient-to-r from-[#696E79]/10 to-[#696E79]/20 text-[#696E79] border-[#696E79]/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'Pending':
                return <AlertCircle className="w-4 h-4" />;
            case 'Completed':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getAppointmentIcon = (status) => {
        return status === 'Completed' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
               status === 'Confirmed' ? 'bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80' :
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
                        <div className="space-y-2 relative">
                            <label className="text-sm font-semibold text-[#132D46]">Select Lecturer</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#696E79]" />
                                <input
                                    name="lecturer"
                                    value={lecturerSearch}
                                    onChange={handleLecturerSearch}
                                    onFocus={() => setShowLecturerDropdown(lecturerSearch.length > 0)}
                                    required
                                    placeholder="Search by name, department, or expertise..."
                                    className="w-full pl-10 pr-4 py-3 border-2 border-[#191E29]/20 rounded-xl text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                                    autoComplete="off"
                                />
                                {showLecturerDropdown && filteredLecturers.length > 0 && (
                                    <div className="absolute z-20 bg-white border-2 border-[#2CC295]/20 w-full mt-2 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {filteredLecturers.map(lecturer => (
                                            <div
                                                key={lecturer.name}
                                                className="px-4 py-3 hover:bg-[#2CC295]/5 cursor-pointer border-b border-[#191E29]/10 last:border-b-0"
                                                onClick={() => handleLecturerSelect(lecturer)}
                                            >
                                                <div className="font-semibold text-[#132D46]">{lecturer.name}</div>
                                                <div className="text-sm text-[#696E79]">{lecturer.department} • {lecturer.expertise}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Duration */}
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
                        </div>

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
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            required
                            placeholder="Please describe the purpose of your appointment..."
                            rows="3"
                            className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                    >
                        <Send className="w-5 h-5" />
                        <span>Request Appointment</span>
                    </button>
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
                    <div key={appointment.id} className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Appointment Header */}
                        <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`${getAppointmentIcon(appointment.status)} p-3 rounded-xl shadow-lg`}>
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#132D46] text-lg">{appointment.lecturer}</h4>
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
                                    <span>Purpose:</span>
                                </h5>
                                <p className="text-[#132D46] font-medium">{appointment.reason}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-[#191E29]/10">
                                    <div className="flex items-center space-x-2 text-[#696E79] font-medium mb-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>Location:</span>
                                    </div>
                                    <p className="text-[#132D46] font-semibold">{appointment.location}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-[#191E29]/10">
                                    <div className="flex items-center space-x-2 text-[#696E79] font-medium mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Duration:</span>
                                    </div>
                                    <p className="text-[#132D46] font-semibold">{appointment.duration}</p>
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
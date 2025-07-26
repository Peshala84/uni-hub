import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContexts';

const mockAppointments = [
    { id: 1, lecturer: 'Dr. Smith', date: '2024-08-01', time: '10:00', reason: 'Discuss project', status: 'Confirmed' },
    { id: 2, lecturer: 'Prof. Lee', date: '2024-08-03', time: '14:00', reason: 'Assignment help', status: 'Pending' }
];

const lecturersList = [
    'Dr. Smith',
    'Prof. Lee',
    'Dr. Johnson',
    'Prof. Williams',
    'Dr. Brown',
    'Prof. Miller'
];

const Appointments = () => {
    const { isLoggedIn } = useAuth();
    const [appointments, setAppointments] = useState(mockAppointments);
    const [form, setForm] = useState({ lecturer: '', date: '', time: '', reason: '' });
    const [lecturerSearch, setLecturerSearch] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLecturerSearch = (e) => {
        setLecturerSearch(e.target.value);
        setForm({ ...form, lecturer: e.target.value });
    };

    const filteredLecturers = lecturersList.filter(l =>
        l.toLowerCase().includes(lecturerSearch.toLowerCase())
    );

    const handleLecturerSelect = (lecturer) => {
        setForm({ ...form, lecturer });
        setLecturerSearch(lecturer);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLoggedIn) return;
        setAppointments([
            ...appointments,
            { id: appointments.length + 1, ...form, status: 'Pending' }
        ]);
        setForm({ lecturer: '', date: '', time: '', reason: '' });
        setLecturerSearch('');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointments with Lecturers</h2>
            <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap relative">
                <div className="w-56 relative">
                    <input
                        name="lecturer"
                        value={lecturerSearch}
                        onChange={handleLecturerSearch}
                        required
                        placeholder="Search Lecturer..."
                        className="border rounded px-2 py-1 w-full"
                        autoComplete="off"
                    />
                    {lecturerSearch && filteredLecturers.length > 0 && (
                        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
                            {filteredLecturers.map(l => (
                                <li
                                    key={l}
                                    className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => handleLecturerSelect(l)}
                                >
                                    {l}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <input name="date" type="date" value={form.date} onChange={handleChange} required className="border rounded px-2 py-1" />
                <input name="time" type="time" value={form.time} onChange={handleChange} required className="border rounded px-2 py-1" />
                <input name="reason" value={form.reason} onChange={handleChange} required placeholder="Reason for appointment" className="border rounded px-2 py-1 flex-1 min-w-[180px]" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Request</button>
            </form>
            <div className="space-y-4">
                {appointments.map(a => (
                    <div key={a.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-gray-800">{a.lecturer}</div>
                            <div className="text-gray-600 text-sm">{a.date} at {a.time}</div>
                            {a.reason && <div className="text-gray-500 text-xs mt-1">Reason: {a.reason}</div>}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{a.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Appointments;

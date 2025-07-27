

import React, { useState } from 'react';
import { User, Mail, Phone, Edit3, Save, X, IdCard, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';

const mockProfile = {
    name: 'Student Name',
    email: 'student@email.com',
    studentId: 'S123456',
    major: 'Computer Science',
    year: '3',
    phone: '0712345678',
    bio: 'Passionate student eager to learn and contribute to the tech community.'
};

const StudentProfile = () => {
    const { isLoggedIn } = useAuth();
    const [profile, setProfile] = useState(mockProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(profile);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setForm(profile);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setForm(profile);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setProfile(form);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
                </div>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl p-6">
                        <div className="text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <User className="h-16 w-16 text-white" />
                                </div>
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="text-xl font-bold text-gray-800 text-center w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{profile.name}</h3>
                            )}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="major"
                                    value={form.major}
                                    onChange={handleChange}
                                    className="text-gray-600 text-center w-full border border-gray-300 rounded-lg px-3 py-1"
                                />
                            ) : (
                                <p className="text-gray-600">{profile.major}</p>
                            )}
                        </div>
                        <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-sm">{profile.email}</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-sm">{profile.phone}</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                <IdCard className="h-5 w-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={form.studentId}
                                        onChange={handleChange}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-sm">{profile.studentId}</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                <BookOpen className="h-5 w-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="year"
                                        value={form.year}
                                        onChange={handleChange}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-sm">Year {profile.year}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Biography */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">About</h4>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 leading-relaxed"
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;

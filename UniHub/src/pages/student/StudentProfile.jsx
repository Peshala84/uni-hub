import React, { useState } from 'react';
import { User, Mail, Phone, Edit3, Save, X, CreditCard, BookOpen, GraduationCap, MapPin, Calendar, Award, Star } from 'lucide-react';

const mockProfile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    studentId: 'CS2021456',
    major: 'Computer Science',
    year: '3',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate computer science student with a keen interest in artificial intelligence and machine learning. I enjoy solving complex problems and contributing to open-source projects. Currently working on my final year project involving natural language processing.',
    gpa: '3.85',
    completedCredits: '98',
    expectedGraduation: 'May 2025',
    location: 'San Francisco, CA'
};

const achievements = [
    { title: 'Dean\'s List', description: 'Fall 2023', icon: Award },
    { title: 'Hackathon Winner', description: 'TechCrunch Disrupt 2023', icon: Star },
    { title: 'Research Assistant', description: 'AI Lab - Spring 2024', icon: BookOpen }
];

const StudentProfile = () => {
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
        <div className="space-y-8 max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Student Profile</h2>
                        <p className="text-[#696E79] font-medium">Manage your personal information and academic details</p>
                    </div>
                </div>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                    >
                        <Edit3 className="w-5 h-5" />
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex space-x-3">
                        <button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                        >
                            <Save className="w-5 h-5" />
                            <span>Save</span>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-white text-[#132D46] px-6 py-3 rounded-xl font-semibold border-2 border-[#191E29]/20 hover:bg-[#F8FFFE] hover:border-[#2CC295]/30 transition-all duration-200 flex items-center space-x-2"
                        >
                            <X className="w-5 h-5" />
                            <span>Cancel</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#132D46] to-[#191E29] px-6 py-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2CC295]/10 to-transparent"></div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-2xl font-bold text-white">
                                        {profile.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="text-xl font-bold text-center w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mb-2 text-white placeholder-white/70"
                                    />
                                ) : (
                                    <h3 className="text-xl font-bold text-white mb-2">{profile.name}</h3>
                                )}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="major"
                                        value={form.major}
                                        onChange={handleChange}
                                        className="text-center w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white/90 placeholder-white/70"
                                    />
                                ) : (
                                    <p className="text-white/90 font-medium">{profile.major}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#2CC295]/10 p-2 rounded-lg">
                                    <Mail className="w-5 h-5 text-[#2CC295]" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="flex-1 border-2 border-[#191E29]/20 rounded-lg px-3 py-2 text-sm text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-[#132D46] font-semibold text-sm">Email</p>
                                        <p className="text-[#696E79] text-sm">{profile.email}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#2CC295]/10 p-2 rounded-lg">
                                    <Phone className="w-5 h-5 text-[#2CC295]" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="flex-1 border-2 border-[#191E29]/20 rounded-lg px-3 py-2 text-sm text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-[#132D46] font-semibold text-sm">Phone</p>
                                        <p className="text-[#696E79] text-sm">{profile.phone}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#2CC295]/10 p-2 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-[#2CC295]" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={form.studentId}
                                        onChange={handleChange}
                                        className="flex-1 border-2 border-[#191E29]/20 rounded-lg px-3 py-2 text-sm text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-[#132D46] font-semibold text-sm">Student ID</p>
                                        <p className="text-[#696E79] text-sm">{profile.studentId}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#2CC295]/10 p-2 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-[#2CC295]" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="year"
                                        value={form.year}
                                        onChange={handleChange}
                                        className="flex-1 border-2 border-[#191E29]/20 rounded-lg px-3 py-2 text-sm text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-[#132D46] font-semibold text-sm">Academic Year</p>
                                        <p className="text-[#696E79] text-sm">Year {profile.year}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Biography */}
                    <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                            <h4 className="text-lg font-bold text-[#132D46] flex items-center space-x-2">
                                <User className="w-5 h-5 text-[#2CC295]" />
                                <span>About Me</span>
                            </h4>
                        </div>
                        <div className="p-6">
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
                                    placeholder="Tell us about yourself, your interests, and goals..."
                                />
                            ) : (
                                <p className="text-[#132D46] font-medium leading-relaxed">{profile.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                            <h4 className="text-lg font-bold text-[#132D46] flex items-center space-x-2">
                                <GraduationCap className="w-5 h-5 text-[#2CC295]" />
                                <span>Academic Information</span>
                            </h4>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-xl p-4 border border-[#2CC295]/20">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Award className="w-5 h-5 text-[#2CC295]" />
                                        <span className="text-[#132D46] font-semibold">Current GPA</span>
                                    </div>
                                    <p className="text-2xl font-bold text-[#2CC295]">{profile.gpa}</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-xl p-4 border border-[#2CC295]/20">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <BookOpen className="w-5 h-5 text-[#2CC295]" />
                                        <span className="text-[#132D46] font-semibold">Credits Completed</span>
                                    </div>
                                    <p className="text-2xl font-bold text-[#2CC295]">{profile.completedCredits}</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-xl p-4 border border-[#2CC295]/20">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Calendar className="w-5 h-5 text-[#2CC295]" />
                                        <span className="text-[#132D46] font-semibold">Expected Graduation</span>
                                    </div>
                                    <p className="text-lg font-bold text-[#132D46]">{profile.expectedGraduation}</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-xl p-4 border border-[#2CC295]/20">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <MapPin className="w-5 h-5 text-[#2CC295]" />
                                        <span className="text-[#132D46] font-semibold">Location</span>
                                    </div>
                                    <p className="text-lg font-bold text-[#132D46]">{profile.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                            <h4 className="text-lg font-bold text-[#132D46] flex items-center space-x-2">
                                <Star className="w-5 h-5 text-[#2CC295]" />
                                <span>Achievements & Recognition</span>
                            </h4>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4">
                                {achievements.map((achievement, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] rounded-xl border border-[#2CC295]/20">
                                        <div className="bg-[#2CC295] p-3 rounded-xl shadow-lg">
                                            <achievement.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-[#132D46]">{achievement.title}</h5>
                                            <p className="text-[#696E79] font-medium">{achievement.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;

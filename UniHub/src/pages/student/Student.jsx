import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../../pages/student/Home';
import Login from '../../components/users/Login';
import Courses from '../../pages/student/Courses';
import Appointments from '../../pages/student/Appointments';
import Resources from '../../pages/student/Resources';
import PeerLearning from '../../pages/student/PeerLearning';
import FeedbackForum from '../../pages/student/FeedbackForum';
import ProfilePage from '../../pages/student/StudentProfile';

function Student() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/peer-learning" element={<PeerLearning />} />
                <Route path="/feedback" element={<FeedbackForum />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </div>
    );
}

export default Student;

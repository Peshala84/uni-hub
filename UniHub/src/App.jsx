import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContexts';
import Lecturer from './pages/lecturer/Lecturer';

import Admin from './pages/admin/Admin'

import Navbar from './components/users/Navbar';

import Home from './pages/lecturer/Home';
import Login from './components/users/Login';
import Courses from './pages/lecturer/Courses';
import Notifications from './pages/lecturer/Notification';
import ProfilePage from './pages/lecturer/Profile';
import StudentQueries from './components/users/StudentQueries';
import Appointments from './components/users/Appointments';
import Resources from './components/users/Resources';
import PeerLearning from './components/users/PeerLearning';
import FeedbackForum from './components/users/FeedbackForum';
import StudentProfile from './components/users/StudentProfile';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/lecturer" replace />} />
            <Route path="/lecturer/*" element={<Lecturer />} />

            <Route path="/admin/*" element={<Admin />} />

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Student routes */}
            <Route path="/student/queries" element={<StudentQueries />} />
            <Route path="/student/appointments" element={<Appointments />} />
            <Route path="/student/resources" element={<Resources />} />
            <Route path="/student/peer-learning" element={<PeerLearning />} />
            <Route path="/student/feedback-forum" element={<FeedbackForum />} />
            <Route path="/student/profile" element={<StudentProfile />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
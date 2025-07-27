import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContexts';
import Lecturer from './pages/lecturer/Lecturer';
import Navbar from './components/users/Navbar';

import Home from './pages/lecturer/Home';
import Login from './components/users/Login';
import LecturerCourses from './pages/lecturer/Courses';
import StudentCourses from './pages/student/Courses';
import Notifications from './pages/lecturer/Notification';
import ProfilePage from './pages/lecturer/Profile';
import StudentQueries from './pages/student/StudentQueries';
import Appointments from './pages/student/Appointments';
import Resources from './pages/student/Resources';
import PeerLearning from './pages/student/PeerLearning';
import FeedbackForum from './pages/student/FeedbackForum';
import StudentProfile from './pages/student/StudentProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/lecturer" replace />} />
            <Route path="/lecturer/*" element={<Lecturer />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<LecturerCourses />} />
            <Route path="/student/courses" element={<StudentCourses />} />
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
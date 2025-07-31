import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContexts';
import Lecturer from './pages/lecturer/Lecturer';

import Admin from './pages/admin/Admin'

import ProtectedRoute from './components/users/ProtectedRoute';
import Navbar from './components/users/Navbar';


import Home from './pages/lecturer/Home';
import Login from './components/users/Login';
import LecturerCourses from './pages/lecturer/Courses';
import Notifications from './pages/lecturer/Notification';
import ProfilePage from './pages/lecturer/Profile';
import Student from './pages/student/Student';
import Navbar from './components/users/Navbar';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar/>
          <Routes>

            <Route path="/student/*" element={<Student />} />

            <Route path="/" element={<Navigate to="/lecturer" replace />} />
            <Route
              path="/lecturer/:userId/*"
              element={
                <ProtectedRoute>
                  <Lecturer /> {/* Your student component/routes */}
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/:userId/*"
              element={
                <ProtectedRoute>
                  <Admin /> {/* Your student component/routes */}
                </ProtectedRoute>
              }
            />


            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<LecturerCourses />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
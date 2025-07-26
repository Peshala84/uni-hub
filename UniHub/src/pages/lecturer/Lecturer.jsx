import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/users/Navbar';
import Home from '../../pages/lecturer/Home';
import Login from '../../components/users/Login';
import Courses from '../../pages/lecturer/Courses';
import Notifications from '../../pages/lecturer/Notification';
import ProfilePage from '../../pages/lecturer/Profile';

function Lecturer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default Lecturer;
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../../pages/lecturer/Home';
import Login from '../../components/users/Login';
import Courses from '../../pages/lecturer/Courses';
import Notifications from '../../pages/lecturer/Notification';
import ProfilePage from '../../pages/lecturer/Profile';
import Appointment from './Appointment';

function Lecturer() {
  return (
    <div className="min-h-screen bg-gray-50">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default Lecturer;
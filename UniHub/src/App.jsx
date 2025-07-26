import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContexts';
import Lecturer from './pages/lecturer/Lecturer';
import Admin from './pages/admin/Admin'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/lecturer" replace />} />
            <Route path="/lecturer/*" element={<Lecturer />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
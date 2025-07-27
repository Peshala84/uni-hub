// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import AddUser from './AddUser';
import ViewStudents from './ViewStudents';
import ViewLecturers from './ViewLecturers';
import ComingSoon from './ComingSoon';
import AddAnnouncements from './Anouncements';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data functions
  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Replace with your real API endpoint
      const response = await axios.get('/api/view_students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      // Replace with your real API endpoint
      const response = await axios.get('/api/view_lecturers');
      setLecturers(response.data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      setLoading(true);
      // Replace with your real API endpoint
      await axios.post('/api/create_user', userData);
      // Refresh data based on user role
      if (userData.role === 'STUDENT') {
        await fetchStudents();
      } else {
        await fetchLecturers();
      }
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view-students') {
      fetchStudents();
    } else if (activeTab === 'view-lecturers') {
      fetchLecturers();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardHome 
            students={students}
            lecturers={lecturers}
            onNavigate={setActiveTab}
          />
        );
      case 'add-user':
        return (
          <AddUser 
            onCreateUser={createUser}
            loading={loading}
          />
        );
      case 'view-students':
        return (
          <ViewStudents
            students={students}
            loading={loading}
            onRefresh={fetchStudents}
          />
        );
      case 'view-lecturers':
        return (
          <ViewLecturers
            lecturers={lecturers}
            loading={loading}
            onRefresh={fetchLecturers}
          />
        );
      case 'announcements':
        return <AddAnnouncements />;
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div className="min-h-screen bg-[#191E29] flex">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
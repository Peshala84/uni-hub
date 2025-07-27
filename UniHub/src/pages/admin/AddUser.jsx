import React, { useState, useCallback } from 'react';
import { Plus, X, GraduationCap, UserCheck } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onSubmit, loading, error, success }) => {
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    NIC: '',
    address: '',
    contact: '',
    DOB: '',
    role: 'STUDENT'
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  const handleClose = useCallback(() => {
    setFormData({
      f_name: '',
      l_name: '',
      email: '',
      NIC: '',
      address: '',
      contact: '',
      DOB: '',
      role: 'STUDENT'
    });
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#132D46] rounded-xl p-6 w-full max-w-md mx-4 border border-[#191E29]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add New User</h3>
          <button
            onClick={handleClose}
            className="text-[#696E79] hover:text-white transition-colors"
            disabled={loading}
            type="button"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-900 border border-green-600 rounded-lg">
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name *"
              value={formData.f_name}
              onChange={(e) => handleInputChange('f_name', e.target.value)}
              className="px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D]"
              required
              disabled={loading}
              autoComplete="given-name"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.l_name}
              onChange={(e) => handleInputChange('l_name', e.target.value)}
              className="px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D]"
              disabled={loading}
              autoComplete="family-name"
            />
          </div>
          
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D]"
            required
            disabled={loading}
            autoComplete="email"
          />
          
          <input
            type="text"
            placeholder="NIC *"
            value={formData.NIC}
            onChange={(e) => handleInputChange('NIC', e.target.value)}
            className="w-full px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D]"
            required
            disabled={loading}
          />
          
          <input
            type="text"
            placeholder="Address *"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D]"
            required
            disabled={loading}
            autoComplete="address-line1"
          />
          
          <input
            type="tel"
            placeholder="Contact *"
            value={formData.contact}
            onChange={(e) => handleInputChange('contact', e.target.value)}
            className="w-full px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D]"
            required
            disabled={loading}
            autoComplete="tel"
          />
          
          <input
            type="date"
            value={formData.DOB}
            onChange={(e) => handleInputChange('DOB', e.target.value)}
            className="w-full px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white focus:outline-none focus:border-[#01C38D]"
            required
            disabled={loading}
            autoComplete="bday"
          />
          
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-4 py-2 bg-[#191E29] border border-[#696E79] rounded-lg text-white focus:outline-none focus:border-[#01C38D]"
            disabled={loading}
          >
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
          </select>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-[#696E79] text-[#696E79] rounded-lg hover:bg-[#191E29] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddUser = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Sending user data:', userData);

      const response = await fetch('http://localhost:8086/api/v1/admin/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get response text first
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        // Try to parse as JSON if response is ok
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid response format from server');
        }

        setSuccess('User created successfully!');
        setTimeout(() => {
          setShowAddUserModal(false);
          setSuccess('');
          setError('');
        }, 2000);
        return { success: true, data };
      } else {
        // Handle error response
        let errorMessage;
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Failed to create user';
        } catch (parseError) {
          // If not JSON, use the text directly
          errorMessage = responseText || 'Failed to create user';
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'An error occurred while creating the user');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddUserModal(false);
    setError('');
    setSuccess('');
  }, []);

  const handleOpenModal = useCallback(() => {
    setShowAddUserModal(true);
    setError('');
    setSuccess('');
  }, []);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Add New User</h2>
        <button
          onClick={handleOpenModal}
          className="flex items-center space-x-2 px-4 py-2 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors"
        >
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>
      
      <div className="bg-[#132D46] rounded-xl p-6 border border-[#191E29]">
        <p className="text-[#696E79] mb-4">Click the "Add User" button to create new student or lecturer accounts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 border border-[#696E79] rounded-lg">
            <GraduationCap className="mx-auto text-[#01C38D] mb-4" size={48} />
            <h3 className="text-white font-bold mb-2">Students</h3>
            <p className="text-[#696E79] text-sm">Add student accounts with access to learning resources</p>
          </div>
          <div className="text-center p-6 border border-[#696E79] rounded-lg">
            <UserCheck className="mx-auto text-[#01C38D] mb-4" size={48} />
            <h3 className="text-white font-bold mb-2">Lecturers</h3>
            <p className="text-[#696E79] text-sm">Add lecturer accounts with teaching privileges</p>
          </div>
        </div>
      </div>
      
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={handleCloseModal}
        onSubmit={createUser}
        loading={loading}
        error={error}
        success={success}
      />
    </div>
  );
};

export default AddUser;
import React, { useState, useEffect, useCallback } from 'react';
import { Download, Filter, Eye, RefreshCw, UserCheck, UserX, X } from 'lucide-react';

const ViewLecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLecturers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching lecturers...');

      const response = await fetch('http://localhost:8086/api/v1/admin/view_lecturers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

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

        // Debug: log raw data
        console.log('Raw lecturers data from backend:', data);

        // Normalize status to is_active boolean (robust)
        const normalized = Array.isArray(data)
          ? data.map(l => {
              const status = (l.status || '').toString().toUpperCase();
              return {
                ...l,
                is_active: !status || status === 'ACTIVE',
              };
            })
          : [];
        console.log('Parsed lecturers data:', normalized);
        setLecturers(normalized);
      } else {
        // Handle error response
        let errorMessage;
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Failed to fetch lecturers';
        } catch (parseError) {
          // If not JSON, use the text directly
          errorMessage = responseText || 'Failed to fetch lecturers';
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error fetching lecturers:', err);
      setError(err.message || 'An error occurred while fetching lecturers');
      setLecturers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch lecturers on component mount
  useEffect(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  const handleRefresh = useCallback(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export lecturers data');
  }, []);

  const handleFilter = useCallback(() => {
    // TODO: Implement filter functionality
    console.log('Filter lecturers data');
  }, []);

  const handleView = useCallback((lecturer) => {
    setSelectedLecturer(lecturer);
    setShowViewModal(true);
  }, []);

  const handleActivationToggle = useCallback((lecturer) => {
    setSelectedLecturer(lecturer);
    setConfirmAction(lecturer.is_active ? 'deactivate' : 'activate');
    setShowConfirmModal(true);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!selectedLecturer || !confirmAction) return;

    try {
      setActionLoading(true);

      const isDeactivate = confirmAction === 'deactivate';
      const endpoint = isDeactivate
        ? 'http://localhost:8086/api/v1/admin/deactivate_user'
        : 'http://localhost:8086/api/v1/admin/reactivate_user';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_Id: selectedLecturer.user_Id
        }),
      });

      const responseText = await response.text();

      if (response.ok) {
        // Update the lecturer's status in the local state (update both is_active and status)
        setLecturers(prevLecturers =>
          prevLecturers.map(lecturer =>
            lecturer.user_Id === selectedLecturer.user_Id
              ? {
                  ...lecturer,
                  is_active: !isDeactivate,
                  status: isDeactivate ? 'DEACTIVATED' : 'ACTIVE',
                }
              : lecturer
          )
        );

        setShowConfirmModal(false);
        setSelectedLecturer(null);
        setConfirmAction(null);

        // Show success message (you can customize this)
        console.log(`Lecturer ${isDeactivate ? 'deactivated' : 'activated'} successfully`);
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || `Failed to ${confirmAction} lecturer`;
        } catch (parseError) {
          errorMessage = responseText || `Failed to ${confirmAction} lecturer`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error(`Error ${confirmAction}ing lecturer:`, err);
      setError(err.message || `An error occurred while ${confirmAction}ing the lecturer`);
    } finally {
      setActionLoading(false);
    }
  }, [selectedLecturer, confirmAction]);

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedLecturer(null);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedLecturer(null);
    setConfirmAction(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Lecturers</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 border border-[#01C38D] text-[#01C38D] rounded-lg hover:bg-[#01C38D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && lecturers.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#01C38D]"></div>
          <p className="text-[#696E79] mt-2">Loading lecturers...</p>
        </div>
      ) : (
        /* Lecturers Table */
        <div className="bg-[#132D46] rounded-xl border border-[#191E29] overflow-hidden">
          <div className="p-6 border-b border-[#191E29]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Lecturers ({lecturers.length})
              </h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>
                <button 
                  onClick={handleFilter}
                  className="flex items-center space-x-2 px-4 py-2 border border-[#01C38D] text-[#01C38D] rounded-lg hover:bg-[#01C38D] hover:text-white transition-colors"
                >
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {lecturers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#696E79]">No lecturers found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#191E29]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      Lecturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      NIC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      DOB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      Lecturer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#696E79] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#191E29]">
                  {lecturers.map((lecturer) => (
                    <tr key={lecturer.user_Id} className="hover:bg-[#191E29] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-[#01C38D] rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {lecturer.f_name ? lecturer.f_name.charAt(0) : 'L'}
                              {lecturer.l_name && lecturer.l_name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {lecturer.f_name || 'Unknown'} {lecturer.l_name || ''}
                            </div>
                            <div className="text-sm text-[#696E79]">{lecturer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{lecturer.contact || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{lecturer.NIC || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{lecturer.address || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{lecturer.DOB || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-[#01C38D] bg-opacity-20 text-[#01C38D] rounded-full">
                          {lecturer.lecturer_Id || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          lecturer.is_active 
                            ? 'bg-green-900 bg-opacity-20 text-green-400' 
                            : 'bg-red-900 bg-opacity-20 text-red-400'
                        }`}>
                          {lecturer.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleView(lecturer)}
                            className="text-[#01C38D] hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleActivationToggle(lecturer)}
                            className={`hover:text-white transition-colors ${
                              lecturer.is_active ? 'text-red-500' : 'text-green-500'
                            }`}
                            title={lecturer.is_active ? 'Deactivate User' : 'Activate User'}
                          >
                            {lecturer.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* View Lecturer Modal */}
      {showViewModal && selectedLecturer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#132D46] border border-[#191E29] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Lecturer Details</h3>
              <button 
                onClick={closeViewModal}
                className="text-[#696E79] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-[#01C38D] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedLecturer.f_name ? selectedLecturer.f_name.charAt(0) : 'L'}
                    {selectedLecturer.l_name && selectedLecturer.l_name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-white">
                    {selectedLecturer.f_name || 'Unknown'} {selectedLecturer.l_name || ''}
                  </h4>
                  <p className="text-[#696E79]">{selectedLecturer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">User ID</label>
                  <p className="text-white">{selectedLecturer.user_Id || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">Lecturer ID</label>
                  <p className="text-white">{selectedLecturer.lecturer_Id || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">First Name</label>
                  <p className="text-white">{selectedLecturer.f_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">Last Name</label>
                  <p className="text-white">{selectedLecturer.l_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">Email</label>
                  <p className="text-white">{selectedLecturer.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">Contact</label>
                  <p className="text-white">{selectedLecturer.contact || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">NIC</label>
                  <p className="text-white">{selectedLecturer.NIC || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">Date of Birth</label>
                  <p className="text-white">{selectedLecturer.DOB || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#696E79] mb-1">Address</label>
                  <p className="text-white">{selectedLecturer.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#696E79] mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedLecturer.is_active 
                      ? 'bg-green-900 bg-opacity-20 text-green-400' 
                      : 'bg-red-900 bg-opacity-20 text-red-400'
                  }`}>
                    {selectedLecturer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedLecturer && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#132D46] border border-[#191E29] rounded-xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                confirmAction === 'deactivate' ? 'bg-red-900 bg-opacity-20' : 'bg-green-900 bg-opacity-20'
              }`}>
                {confirmAction === 'deactivate' ? 
                  <UserX className="h-6 w-6 text-red-400" /> : 
                  <UserCheck className="h-6 w-6 text-green-400" />
                }
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {confirmAction === 'deactivate' ? 'Deactivate' : 'Activate'} Lecturer
              </h3>
              <p className="text-sm text-[#696E79] mb-6">
                Are you sure you want to {confirmAction} {selectedLecturer.f_name} {selectedLecturer.l_name}? 
                {confirmAction === 'deactivate' 
                  ? ' This will prevent them from logging in.' 
                  : ' This will allow them to log in again.'
                }
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={closeConfirmModal}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-[#696E79] text-[#696E79] rounded-lg hover:bg-[#191E29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    confirmAction === 'deactivate'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {actionLoading ? 'Processing...' : confirmAction === 'deactivate' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLecturers;
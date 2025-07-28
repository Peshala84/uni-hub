import React, { useState, useEffect, useCallback } from 'react';
import { Download, Filter, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';

const ViewStudents = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLecturers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching lecturers...');

      const response = await fetch('http://localhost:8086/api/v1/admin/view_students', {
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

        console.log('Parsed lecturers data:', data);
        setLecturers(Array.isArray(data) ? data : []);
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
    // TODO: Implement view lecturer details
    console.log('View lecturer:', lecturer);
  }, []);

  const handleEdit = useCallback((lecturer) => {
    // TODO: Implement edit lecturer functionality
    console.log('Edit lecturer:', lecturer);
  }, []);

  const handleDelete = useCallback((lecturer) => {
    // TODO: Implement delete lecturer functionality
    console.log('Delete lecturer:', lecturer);
  }, []);

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
                      Student
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
                            onClick={() => handleEdit(lecturer)}
                            className="text-blue-500 hover:text-white transition-colors"
                            title="Edit Lecturer"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(lecturer)}
                            className="text-red-500 hover:text-white transition-colors"
                            title="Delete Lecturer"
                          >
                            <Trash2 size={16} />
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
    </div>
  );
};

export default ViewStudents;
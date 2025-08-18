import React, { useState, useEffect } from 'react';
import { Download, FileText, File, User, Calendar, BookMarked, Search, Filter, AlertCircle } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Get student ID from localStorage, context, or props
  const studentId = localStorage.getItem('studentId') || 1; // Default for testing

  useEffect(() => {
    fetchResources();
  }, [studentId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8086/student/${studentId}/resources`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const data = await response.json();
      setResources(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resourceId, fileName) => {
    try {
      const response = await fetch(`http://localhost:8086/student/resource/${resourceId}/download`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading file: ' + err.message);
    }
  };

  const getFileIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'DOCX':
      case 'DOC':
        return <File className="w-6 h-6 text-blue-500" />;
      case 'PPTX':
      case 'PPT':
        return <File className="w-6 h-6 text-orange-500" />;
      case 'XLSX':
      case 'XLS':
        return <File className="w-6 h-6 text-green-500" />;
      default:
        return <File className="w-6 h-6 text-[#696E79]" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DOCX':
      case 'DOC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PPTX':
      case 'PPT':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'XLSX':
      case 'XLS':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.lecturerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || resource.fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getUniqueFileTypes = () => {
    const types = resources.map(r => r.fileType).filter(Boolean);
    return [...new Set(types)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2CC295]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Learning Resources</h2>
            <p className="text-[#696E79] font-medium">Access materials shared by your instructors</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Resources</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchResources}
                className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
          <BookMarked className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Learning Resources</h2>
          <p className="text-[#696E79] font-medium">Access materials shared by your instructors</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#696E79]" />
            <input
              type="text"
              placeholder="Search by file name, lecturer, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#191E29]/20 rounded-xl text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#696E79]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#191E29]/20 rounded-xl text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
            >
              <option value="All">All Types</option>
              {getUniqueFileTypes().map(type => (
                <option key={type} value={type}>{type} Files</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#132D46] flex items-center space-x-2">
            <File className="w-5 h-5 text-[#2CC295]" />
            <span>Available Resources</span>
            <span className="bg-[#2CC295]/20 text-[#2CC295] px-3 py-1 rounded-full text-sm font-semibold">
              {filteredResources.length}
            </span>
          </h3>
          
          <button 
            onClick={fetchResources}
            className="px-4 py-2 bg-[#2CC295]/10 text-[#2CC295] rounded-xl font-medium hover:bg-[#2CC295]/20 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredResources.map(resource => (
            <div key={resource.resourceId} className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Resource Header */}
              <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-md">
                      {getFileIcon(resource.fileType)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#132D46] text-lg">{resource.fileName}</h4>
                      <div className="flex items-center space-x-4 text-[#696E79] font-medium">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{resource.lecturerName || 'Unknown Lecturer'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookMarked className="w-4 h-4" />
                          <span>{resource.courseName || 'Unknown Course'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {resource.fileType && (
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getTypeColor(resource.fileType)}`}>
                      {resource.fileType}
                    </span>
                  )}
                </div>
              </div>

              {/* Resource Content */}
              <div className="p-6">
                {resource.description && (
                  <p className="text-[#132D46] font-medium mb-4">{resource.description}</p>
                )}

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-6 text-sm text-[#696E79] font-medium">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(resource.uploadDate)}</span>
                    </div>
                    {resource.fileSize && (
                      <div className="flex items-center space-x-1">
                        <File className="w-4 h-4" />
                        <span>{resource.fileSize}</span>
                      </div>
                    )}
                    {resource.downloadCount !== undefined && (
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{resource.downloadCount} downloads</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownload(resource.resourceId, resource.fileName)}
                    className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-[#F8FFFE] rounded-2xl p-8 border border-[#2CC295]/20">
              <BookMarked className="w-12 h-12 text-[#696E79] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#132D46] mb-2">
                {resources.length === 0 ? 'No resources available' : 'No resources found'}
              </h3>
              <p className="text-[#696E79] font-medium">
                {resources.length === 0 
                  ? 'Your instructors haven\'t shared any resources yet.' 
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;


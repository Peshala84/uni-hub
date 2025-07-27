
import React, { useState } from 'react';
import { Download, FileText, File, User, Calendar, BookMarked, Search, Filter } from 'lucide-react';

const mockResources = [
  { 
    id: 1, 
    title: 'Lecture 1 Slides - Introduction to Computer Science', 
    url: '#', 
    type: 'PDF', 
    sharedBy: 'Dr. Smith',
    date: '2024-07-25',
    size: '2.4 MB',
    downloads: 125,
    description: 'Comprehensive introduction covering fundamental concepts and course overview.'
  },
  { 
    id: 2, 
    title: 'Assignment 2 Instructions - Data Structures', 
    url: '#', 
    type: 'DOCX', 
    sharedBy: 'Prof. Lee',
    date: '2024-07-20',
    size: '1.8 MB',
    downloads: 89,
    description: 'Detailed instructions for implementing binary trees and hash tables.'
  },
  { 
    id: 3, 
    title: 'Lab Manual - Programming Exercises', 
    url: '#', 
    type: 'PDF', 
    sharedBy: 'Dr. Johnson',
    date: '2024-07-18',
    size: '5.2 MB',
    downloads: 203,
    description: 'Complete lab exercises with step-by-step solutions and explanations.'
  }
];

const Resources = () => {
  const [resources] = useState(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'DOCX':
        return <File className="w-6 h-6 text-blue-500" />;
      default:
        return <File className="w-6 h-6 text-[#696E79]" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DOCX':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.sharedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || resource.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
              placeholder="Search resources..."
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
              <option value="PDF">PDF Files</option>
              <option value="DOCX">Word Documents</option>
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
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredResources.map(resource => (
            <div key={resource.id} className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Resource Header */}
              <div className="bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] px-6 py-4 border-b border-[#191E29]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-md">
                      {getFileIcon(resource.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#132D46] text-lg">{resource.title}</h4>
                      <p className="text-[#696E79] font-medium flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Shared by {resource.sharedBy}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>
              </div>

              {/* Resource Content */}
              <div className="p-6">
                <p className="text-[#132D46] font-medium mb-4">{resource.description}</p>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-6 text-sm text-[#696E79] font-medium">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{resource.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <File className="w-4 h-4" />
                      <span>{resource.size}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads} downloads</span>
                    </div>
                  </div>
                  
                  <a 
                    href={resource.url} 
                    download
                    className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#F8FFFE] rounded-2xl p-8 border border-[#2CC295]/20">
              <BookMarked className="w-12 h-12 text-[#696E79] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#132D46] mb-2">No resources found</h3>
              <p className="text-[#696E79] font-medium">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources; 

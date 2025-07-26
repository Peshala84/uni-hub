import React from 'react';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
              <GraduationCap className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Metropolitan University
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Welcome to your comprehensive lecturer management portal. Streamline your teaching, 
            manage courses, and engage with students efficiently.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <BookOpen className="h-12 w-12 text-blue-200 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Course Management</h3>
              <p className="text-blue-100 text-sm">
                Organize assignments, resources, and track student progress
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <Users className="h-12 w-12 text-blue-200 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Student Interaction</h3>
              <p className="text-blue-100 text-sm">
                Handle queries, provide feedback, and communicate effectively
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <GraduationCap className="h-12 w-12 text-blue-200 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Academic Excellence</h3>
              <p className="text-blue-100 text-sm">
                Foster learning with modern tools and streamlined processes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
import React from 'react';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            NSBM Green University
          </h1>
          
          <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl">
            Welcome to lecturer. Streamline your teaching, 
            manage courses, and engage with students efficiently.
          </p>
          
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
            <div className="p-6 transition-all duration-300 transform bg-white/10 backdrop-blur-sm rounded-xl hover:scale-105">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="mb-2 text-lg font-semibold">Course Management</h3>
              <p className="text-sm text-blue-100">
                Organize assignments, resources, and track student progress
              </p>
            </div>
            
            <div className="p-6 transition-all duration-300 transform bg-white/10 backdrop-blur-sm rounded-xl hover:scale-105">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="mb-2 text-lg font-semibold">Student Interaction</h3>
              <p className="text-sm text-blue-100">
                Handle queries, provide feedback, and communicate effectively
              </p>
            </div>
            
            <div className="p-6 transition-all duration-300 transform bg-white/10 backdrop-blur-sm rounded-xl hover:scale-105">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="mb-2 text-lg font-semibold">Academic Excellence</h3>
              <p className="text-sm text-blue-100">
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
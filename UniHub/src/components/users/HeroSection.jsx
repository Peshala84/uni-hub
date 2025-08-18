import React from 'react';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import NSBMPhoto from '../../assets/nsbm_photo.jpeg'; // Adjust the path as necessary

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden text-white bg-gradient-to-r from-custom-blue to-custom-green">
      {/* Animated blurred background image */}
      <img
        src={NSBMPhoto}
        alt="NSBM Campus"
        className="absolute inset-0 z-0 object-cover w-full h-full pointer-events-none select-none blur-md opacity-60 animate-pulse"
        style={{ 
          filter: 'blur(2px)', 
          objectPosition: 'center',
          animation: 'gentle-pulse 4s ease-in-out infinite'
        }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 z-5">
        <div className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce top-20 left-10" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-40 animate-bounce top-32 right-20" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute w-3 h-3 bg-white rounded-full opacity-20 animate-bounce bottom-32 left-1/4" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute w-2 h-2 bg-blue-100 rounded-full opacity-25 animate-bounce top-1/2 right-1/3" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}></div>
      </div>

      {/* Gradient overlay content */}
      <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Animated icon container */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm transform transition-all duration-1000 hover:scale-110 hover:rotate-6 hover:bg-white/20 animate-fade-in-down">
              <GraduationCap className="w-16 h-16 text-white animate-pulse" style={{ animationDuration: '4s' }} />
            </div>
          </div>
          
          {/* Animated title */}
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl transform transition-all duration-1300 animate-fade-in-up hover:scale-105">
            NSBM Green University
          </h1>
          
          {/* Animated subtitle */}
          <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl transform transition-all duration-1500 animate-fade-in-up opacity-90 hover:opacity-100" style={{ animationDelay: '0.2s' }}>
            Welcome to lecturer. Streamline your teaching,
            manage courses, and engage with students efficiently.
          </p>
          
          {/* Animated feature cards */}
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
            <div className="p-6 transition-all duration-500 transform bg-white/10 backdrop-blur-sm rounded-xl hover:scale-110 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl animate-fade-in-up group" style={{ animationDelay: '0.4s' }}>
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-200 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <h3 className="mb-2 text-lg font-semibold transition-all duration-500 group-hover:text-white">Course Management</h3>
              <p className="text-sm text-blue-100 transition-all duration-500 group-hover:text-blue-50">
                Organize assignments, resources, and track student progress
              </p>
            </div>
            
            <div className="p-6 transition-all duration-500 transform bg-white/10 backdrop-blur-sm rounded-xl hover:scale-110 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl animate-fade-in-up group" style={{ animationDelay: '0.6s' }}>
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-200 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <h3 className="mb-2 text-lg font-semibold transition-all duration-500 group-hover:text-white">Student Interaction</h3>
              <p className="text-sm text-blue-100 transition-all duration-500 group-hover:text-blue-50">
                Handle queries, provide feedback, and communicate effectively
              </p>
            </div>
            
            <div className="p-6 transition-all duration-500 transform bg-white/10 backdrop-blur-sm rounded-xl hover:scale-110 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl animate-fade-in-up group" style={{ animationDelay: '0.8s' }}>
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-blue-200 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <h3 className="mb-2 text-lg font-semibold transition-all duration-500 group-hover:text-white">Academic Excellence</h3>
              <p className="text-sm text-blue-100 transition-all duration-500 group-hover:text-blue-50">
                Foster learning with modern tools and streamlined processes
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom keyframe animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gentle-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 1.2s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
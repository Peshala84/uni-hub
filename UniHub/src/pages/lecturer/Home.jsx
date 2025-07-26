import React from 'react';
import HeroSection from '../../components/users/HeroSection';
import Announcement from '../../components/users/Announcement';
import Calendar from '../../components/users/Calendar';
import { useAuth } from '../../contexts/AuthContexts';

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {isLoggedIn ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <Calendar />
            </div>
            <div>
              <Announcement />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Announcement />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
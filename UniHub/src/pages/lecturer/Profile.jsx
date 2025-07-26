import React from 'react';
import Profile from '../../components/users/Profile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;
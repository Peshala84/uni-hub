import React from 'react';
import Announcement from '../../components/users/Announcement';
import HeroSection from '../../components/users/HeroSection';
import Passpaper from '../../components/users/Passpaper';


function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FFFE] via-[#FFFFFF] to-[#F0FFF4] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}


                {/* Student Announcements Section */}
                <div className="flex items-center mb-4 space-x-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 text-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
                    </span>
                    <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">Student Announcements</h2>
                </div>
                <div className="p-8 bg-white rounded-2xl shadow-lg border border-[#191E29]/10 mb-8">
                    <Announcement />
                </div>
                <div className="p-8 bg-white rounded-2xl shadow-lg border border-[#191E29]/10 mb-8">
                    <Passpaper />
                </div>
            </div>
        </div>
    );
}

export default Home;

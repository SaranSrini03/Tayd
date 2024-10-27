// app/welcome/page.js

"use client";

import { useRouter } from 'next/navigation';
import NavBar from '../../components/NavBar'; // Import NavBar component

export default function WelcomePage() {
  const router = useRouter();

  const handleExplore = () => {
    router.push('/explore'); // Navigate to explore page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <NavBar /> {/* Add NavBar */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-white text-center px-4 space-y-6">
        <h1 className="text-5xl font-bold">Welcome to TAYD!</h1>
        <p className="text-lg">
          A simple place to share and reflect on your day. Dive in and start exploring!
        </p>
        <button
          onClick={handleExplore}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium text-lg hover:bg-blue-600 hover:text-white transition"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
}

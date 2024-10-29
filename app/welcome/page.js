// app/welcome/page.js
"use client";

import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs"; // Import useUser to get user details

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useUser(); // Get user details

  const handleExplore = () => {
    if (user) {
      router.push('/explore'); // Navigate to explore page if user is logged in
    } else {
      router.push('/auth'); // Navigate to sign-in page if user is not logged in
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-white text-center px-4 space-y-4">
        <h1 className="text-5xl font-bold">Welcome to TAYD!</h1>
        <p className="text-lg text-gray-100">
          A simple place to share and reflect on your day. Dive in and start exploring!
        </p>
        <button
          onClick={handleExplore}
          className="bg-white text-blue-600 px-6 py-3 font-bold rounded-lg text-lg hover:border hover:border-white hover:bg-blue-600 hover:text-white transition"
        >
          Explore Now.
        </button>
      </div>
    </div>
  );
}

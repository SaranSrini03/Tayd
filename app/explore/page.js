// app/explore/page.js

"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../../components/NavBar'; // Import the NavBar component

export default function ExplorePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar /> {/* Add the NavBar component */}
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">
          Hello, {user.firstName + " " + user.lastName || user.username}!
        </h1>
        <h2 className="text-2xl text-gray-700">Thanks for logging in</h2>
        <h2 className="text-xl text-gray-500">We are currently in development</h2>
      </div>
    </div>
  );
}

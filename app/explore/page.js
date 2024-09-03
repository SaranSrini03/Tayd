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
    <div>
      <NavBar /> {/* Add the NavBar component */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Hello, {user.firstName + " " + user.lastName || user.username}!</h1>
        <h2>Thanks for logging in</h2>
        <h2>We are currently in development</h2>
      </div>
    </div>
  );
}

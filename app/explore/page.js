"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null; // 
  }

  return (
    <div>
      <h1>Hello, {user.firstName +" "+ user.lastName || user.username}!</h1>
      <h2>Thanks for logged in</h2>
      <h2>We are currently in development</h2>
    </div>
  );
}

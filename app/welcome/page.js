"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading state if you prefer
  }

  return (
    <div>
      <h1>Hello, {user.firstName || user.username}!</h1>
    </div>
  );
}

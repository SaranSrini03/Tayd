// app/auth/page.js

"use client";

import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function AuthPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push('/explore');
    }
  }, [isLoaded, userId, router]);

  // Define inline styles
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6', // Light gray background
  };

  const signinWrapperStyle = {
    padding: '1.5rem', // Adjust padding as needed
    borderRadius: '0.375rem', // Rounded corners
    maxWidth: '400px', // Optional: limit the width
    width: '100%', // Ensure it is responsive
  };

  return (
    <div style={containerStyle}>
      <div style={signinWrapperStyle}>
        <SignIn routing="hash" />
      </div>
    </div>
  );
}

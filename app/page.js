// app/page.js

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/welcome'); // Redirect to /welcome on page load
  }, [router]);

  return null; // No UI is needed for this route
}

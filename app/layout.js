"use client"; // Mark this as a Client Component

import { ClerkProvider } from '@clerk/nextjs';
import NavBar from '../components/NavBar'; // Import the NavBar component
import './globals.css';
import { usePathname } from 'next/navigation';


export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current route

  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {/* Render NavBar only if the route is not '/welcome' */}
          {pathname !== '/welcome' && <NavBar />}
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

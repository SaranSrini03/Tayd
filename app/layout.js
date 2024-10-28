// app/layout.js
"use client"; // Mark this as a Client Component

import { ClerkProvider } from '@clerk/nextjs';
import NavBar from '../components/NavBar'; // Import the NavBar component
import './globals.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current route

  // Define a list of paths where the NavBar should not be rendered
  const noNavBarPaths = ['/welcome', '/auth']; 

  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {/* Render NavBar only if the current path is not in the noNavBarPaths array */}
          {!noNavBarPaths.includes(pathname) && <NavBar />}
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

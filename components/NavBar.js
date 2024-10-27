// components/NavBar.js

"use client";

import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { FaHome, FaUsers, FaPen, FaBook, FaBell } from 'react-icons/fa'; // Importing icons from react-icons

export default function NavBar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const profileImageRef = useRef(null);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const navToHome = () => {
    router.push('/explore');
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(' ');
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const userInitials = user?.fullName
    ? getInitials(user.fullName)
    : 'U'; // Default to 'U' if no name available

  return (
    <nav className="bg-white bg-opacity-60 backdrop-blur-3xl shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h2 
          className="text-blue-800 font-mono text-2xl font-bold cursor-pointer"
          onClick={navToHome}
        >
          TAYD.
        </h2>

        {/* Icons Section */}
        <div className="hidden md:flex space-x-20"> {/* Keep this section hidden on mobile */}
          <button onClick={navToHome} className="flex items-center">
            <FaHome className="w-7 h-7 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaUsers className="w-7 h-7 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaPen className="w-7 h-7 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaBook className="w-7 h-7 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaBell className="w-7 h-7 text-blue-800" />
          </button>
        </div>

        {/* Mobile Icons Section */}
        <div className="flex md:hidden space-x-5"> {/* Keep this section visible only on mobile */}
          <button onClick={navToHome} className="flex items-center">
            <FaHome className="w-6 h-6 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaUsers className="w-6 h-6 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaPen className="w-6 h-6 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaBook className="w-6 h-6 text-blue-800" />
          </button>
          <button className="flex items-center">
            <FaBell className="w-6 h-6 text-blue-800" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              ref={profileImageRef}
              src={user.profileImageUrl}
              alt="Profile"
              className="w-10 h-10 border border-black rounded-full cursor-pointer"
              onClick={toggleDropdown}
              onError={() => {
                profileImageRef.current.src = 'https://ui-avatars.com/api/?name=Default';
              }}
            />
          ) : (
            <div
              onClick={toggleDropdown}
              className="w-10 h-10 flex items-center justify-center bg-blue-800 text-white font-bold rounded-full cursor-pointer"
            >
              {userInitials}
            </div>
          )}

          {/* Dropdown Card */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-300 border rounded-lg shadow-lg">
              <div className="p-4 text-center">
                <p className="font-medium">{user?.fullName || user?.username}</p>
                <p className="text-sm text-gray-500">{user?.emailAddress}</p>
              </div>
              <hr />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

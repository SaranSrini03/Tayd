// components/NavBar.js
"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebaseConfig"; // Firebase

export default function NavBar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const profileImageRef = useRef(null);

  const handleLogout = async () => {
    await signOut();
    router.push("/welcome"); // Navigate to the welcome page after logout
  };

  const navToHome = () => router.push("/explore");

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, "posts"), {
        text: inputValue,
        user: user.fullName || user.username || "Anonymous",
        timestamp: serverTimestamp(),
      });
      setInputValue("");
      closePopup();
      router.push("/explore"); // Navigate to explore page after posting
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const userInitials = user?.fullName ? getInitials(user.fullName) : "U";

  return (
    <>
      <nav className="bg-white bg-opacity-60 backdrop-blur-3xl shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h2
            className="text-blue-800 font-mono text-2xl font-bold cursor-pointer"
            onClick={navToHome}
          >
            TAYD.
          </h2>

          <div className="hidden md:flex space-x-28">
            <button onClick={navToHome} className="flex items-center">
              <HomeOutlinedIcon className="w-6 h-6 text-blue-800" />
            </button>
            <button className="flex items-center">
              <PeopleOutlinedIcon className="w-6 h-6 text-blue-800" />
            </button>
            <button onClick={openPopup} className="flex items-center">
              <CreateOutlinedIcon className="w-6 h-6 text-blue-800" />
            </button>
            <button className="flex items-center">
              <BookOutlinedIcon className="w-6 h-6 text-blue-800" />
            </button>
            <button className="flex items-center">
              <NotificationsOutlinedIcon className="w-6 h-6 text-blue-800" />
            </button>
          </div>

          <div className="relative">
            {user?.profileImageUrl ? (
              <img
                ref={profileImageRef}
                src={user.profileImageUrl}
                alt="Profile"
                className="w-10 h-10 border border-black rounded-full cursor-pointer"
                onClick={toggleDropdown}
                onError={() =>
                  (profileImageRef.current.src =
                    "https://ui-avatars.com/api/?name=Default")
                }
              />
            ) : (
              <div
                onClick={toggleDropdown}
                className="w-10 h-10 flex items-center justify-center bg-blue-800 text-white font-bold rounded-full cursor-pointer"
              >
                {userInitials}
              </div>
            )}

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-300 border rounded-lg shadow-lg">
                <div className="p-4 text-center">
                  <p className="font-medium">
                    {user?.fullName || user?.username}
                  </p>
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

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md md:hidden">
        <div className="flex justify-around py-2">
          <button onClick={navToHome} className="flex items-center">
            <HomeOutlinedIcon className="w-6 h-6 text-blue-800" />
          </button>
          <button className="flex items-center">
            <PeopleOutlinedIcon className="w-6 h-6 text-blue-800" />
          </button>
          <button onClick={openPopup} className="flex items-center">
            <CreateOutlinedIcon className="w-6 h-6 text-blue-800" />
          </button>
          <button className="flex items-center">
            <BookOutlinedIcon className="w-6 h-6 text-blue-800" />
          </button>
          <button className="flex items-center">
            <NotificationsOutlinedIcon className="w-6 h-6 text-blue-800" />
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4">
            <h2 className="text-xl font-bold text-center">Add Your Thought</h2>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type something..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex justify-between space-x-4">
              <button
                onClick={closePopup}
                className="w-full px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

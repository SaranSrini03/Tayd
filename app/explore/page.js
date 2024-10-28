// app/explore/page.js
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useUser } from "@clerk/nextjs"; // Import useUser to get user details
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const { user, isLoaded } = useUser(); // Get user details and loading state
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };

    // Redirect to welcome page if user is not logged in and is loaded
    if (isLoaded && !user) {
      router.push('/welcome');
    } else if (isLoaded && user) {
      fetchPosts(); // Fetch posts if the user is logged in
    }
  }, [user, isLoaded, router]); // Include user, isLoaded, and router in dependencies

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <div className="space-y-4">
        {posts.length ? (
          posts.map((post) => (
            <div key={post.id} className="p-4 bg-white shadow-md rounded-md">
              <h2 className="text-xl font-semibold">{post.user}</h2>
              <p className="mt-2">{post.text}</p>
              <p className="mt-2 text-sm text-gray-500">
                {post.timestamp.toDate().toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No posts yet. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
}

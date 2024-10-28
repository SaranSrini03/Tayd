"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig"; // Firebase configuration
import CircularProgress from "@mui/material/CircularProgress";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Thoughts</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-4 border rounded-lg shadow-md bg-white"
              >
                <h2 className="text-xl font-semibold">{post.user}</h2>
                <p className="mt-2 text-gray-700">{post.text}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(post.timestamp?.seconds * 1000).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
}

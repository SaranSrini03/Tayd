"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, updateDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../lib/firebaseConfig";
import { useUser } from "@clerk/nextjs"; // Import useUser to get user details
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"; // Like icon
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt"; // Dislike icon

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const { user } = useUser(); // Get user details
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Redirect to welcome page if user is not logged in
    if (!user) {
      router.push('/welcome');
    } else {
      const fetchPosts = async () => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      };

      fetchPosts();
    }
  }, [user, router]); // Include user and router in dependencies

  const handleLike = async (postId) => {
    const postRef = doc(db, "posts", postId);
    
    // Find the post to check current like status
    const post = posts.find((p) => p.id === postId);
    
    // Toggle like
    if (post.likedBy?.includes(user.id)) {
      // User already liked, so unlike it
      await updateDoc(postRef, {
        likes: (post.likes || 0) - 1,
        likedBy: post.likedBy.filter(id => id !== user.id), // Remove user ID from likedBy array
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: (post.likes || 0) - 1, likedBy: post.likedBy.filter(id => id !== user.id) } : post
        )
      );
    } else {
      // User has not liked it yet, so like it
      if (post.dislikedBy?.includes(user.id)) {
        // User already disliked, so reset dislike count and add like
        await updateDoc(postRef, {
          dislikes: 0, // Set dislikes to 0
          likedBy: [...(post.likedBy || []), user.id], // Add user ID to likedBy array
          likes: (post.likes || 0) + 1, // Increment like count
          dislikedBy: post.dislikedBy.filter(id => id !== user.id), // Remove user ID from dislikedBy array
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? {
              ...post,
              dislikes: 0,
              likes: (post.likes || 0) + 1,
              likedBy: [...(post.likedBy || []), user.id],
              dislikedBy: post.dislikedBy.filter(id => id !== user.id),
            } : post
          )
        );
      } else {
        // User has not disliked it yet, so like it
        await updateDoc(postRef, {
          likes: (post.likes || 0) + 1,
          likedBy: [...(post.likedBy || []), user.id], // Add user ID to likedBy array
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: (post.likes || 0) + 1, likedBy: [...(post.likedBy || []), user.id] } : post
          )
        );
      }
    }
  };

  const handleDislike = async (postId) => {
    const postRef = doc(db, "posts", postId);
    
    // Find the post to check current dislike status
    const post = posts.find((p) => p.id === postId);
    
    // Check if the user has already liked the post
    if (post.likedBy?.includes(user.id)) {
      // User already liked, so reset like count and add dislike
      await updateDoc(postRef, {
        likes: 0, // Set likes to 0
        dislikedBy: [...(post.dislikedBy || []), user.id], // Add user ID to dislikedBy array
        dislikes: (post.dislikes || 0) + 1, // Increment dislike count
        likedBy: post.likedBy.filter(id => id !== user.id), // Remove user ID from likedBy array
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? {
            ...post,
            likes: 0,
            dislikes: (post.dislikes || 0) + 1,
            dislikedBy: [...(post.dislikedBy || []), user.id],
            likedBy: post.likedBy.filter(id => id !== user.id),
          } : post
        )
      );
    } else {
      // User has not disliked it yet, so add dislike
      if (post.dislikedBy?.includes(user.id)) {
        // User already disliked, so remove dislike
        await updateDoc(postRef, {
          dislikes: (post.dislikes || 0) - 1,
          dislikedBy: post.dislikedBy.filter(id => id !== user.id), // Remove user ID from dislikedBy array
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, dislikes: (post.dislikes || 0) - 1, dislikedBy: post.dislikedBy.filter(id => id !== user.id) } : post
          )
        );
      } else {
        // User has not disliked it yet, so add dislike
        await updateDoc(postRef, {
          dislikes: (post.dislikes || 0) + 1,
          dislikedBy: [...(post.dislikedBy || []), user.id], // Add user ID to dislikedBy array
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, dislikes: (post.dislikes || 0) + 1, dislikedBy: [...(post.dislikedBy || []), user.id] } : post
          )
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="container p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 mt-0">Explore</h1> {/* Set margin-top to 0 */}
        <div className="space-y-4 w-full max-w-md">
          {posts.length ? (
            posts.map((post) => (
              <div key={post.id} className="p-4 bg-white shadow-md rounded-md">
                <h2 className="text-xl font-semibold">{post.user}</h2>
                <p className="mt-2">{post.text}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {post.timestamp?.toDate().toLocaleString()}
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                  <div className="flex items-center cursor-pointer" onClick={() => handleLike(post.id)}>
                    <ThumbUpAltIcon className={`text-blue-500 ${post.likedBy?.includes(user.id) ? 'text-blue-600' : ''}`} />
                    <span className="ml-1">{post.likes || 0}</span>
                  </div>
                  <div className="flex items-center cursor-pointer" onClick={() => handleDislike(post.id)}>
                    <ThumbDownAltIcon className={`text-red-500 ${post.dislikedBy?.includes(user.id) ? 'text-red-600' : ''}`} />
                    <span className="ml-1">{post.dislikes || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts yet. Be the first to add one!</p>
          )}
        </div>
      </div>
    </div>
  );
}

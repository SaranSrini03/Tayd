"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false);
    };

    if (isLoaded) {
      if (!user) {
        router.push("/welcome");
      } else {
        fetchPosts();
      }
    }
  }, [user, isLoaded, router]);

  const notify = (message) => toast(message);

  const saveNotification = async (postUserId, message) => {
    try {
      await addDoc(collection(db, "notifications"), {
        userId: postUserId,
        message,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  };

  const handleLike = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);

    if (!post) return; // Ensure post exists

    const alreadyLiked = post.likedBy?.some((u) => u.id === user.id);
    const alreadyDisliked = post.dislikedBy?.some((u) => u.id === user.id);

    // If user already disliked, remove dislike first
    if (alreadyDisliked) {
      await updateDoc(postRef, {
        dislikes: (post.dislikes || 0) - 1,
        dislikedBy: post.dislikedBy.filter((u) => u.id !== user.id),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, dislikes: (p.dislikes || 0) - 1, dislikedBy: post.dislikedBy.filter((u) => u.id !== user.id) }
            : p
        )
      );
      notify(`You undisliked ${post.user}'s post.`);
    }

    // Toggle like
    if (alreadyLiked) {
      await updateDoc(postRef, {
        likes: (post.likes || 0) - 1,
        likedBy: post.likedBy.filter((u) => u.id !== user.id),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: (p.likes || 0) - 1, likedBy: post.likedBy.filter((u) => u.id !== user.id) }
            : p
        )
      );
      notify(`You unliked ${post.user}'s post.`);
    } else {
      await updateDoc(postRef, {
        likes: (post.likes || 0) + 1,
        likedBy: [...(post.likedBy || []), { id: user.id, name: user.fullName }],
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: (p.likes || 0) + 1, likedBy: [...(post.likedBy || []), { id: user.id, name: user.fullName }] }
            : p
        )
      );
      notify(`${user.fullName} liked ${post.user}'s post.`);
      await saveNotification(post.userId, `${user.fullName} liked your post.`);
    }
  };

  const handleDislike = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);

    if (!post) return; // Ensure post exists

    const alreadyDisliked = post.dislikedBy?.some((u) => u.id === user.id);
    const alreadyLiked = post.likedBy?.some((u) => u.id === user.id);

    // If user already liked, remove like first
    if (alreadyLiked) {
      await updateDoc(postRef, {
        likes: (post.likes || 0) - 1,
        likedBy: post.likedBy.filter((u) => u.id !== user.id),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: (p.likes || 0) - 1, likedBy: post.likedBy.filter((u) => u.id !== user.id) }
            : p
        )
      );
      notify(`You unliked ${post.user}'s post.`);
    }

    // Toggle dislike
    if (alreadyDisliked) {
      await updateDoc(postRef, {
        dislikes: (post.dislikes || 0) - 1,
        dislikedBy: post.dislikedBy.filter((u) => u.id !== user.id),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, dislikes: (p.dislikes || 0) - 1, dislikedBy: post.dislikedBy.filter((u) => u.id !== user.id) }
            : p
        )
      );
      notify(`You undisliked ${post.user}'s post.`);
    } else {
      await updateDoc(postRef, {
        dislikes: (post.dislikes || 0) + 1,
        dislikedBy: [...(post.dislikedBy || []), { id: user.id, name: user.fullName }],
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, dislikes: (p.dislikes || 0) + 1, dislikedBy: [...(post.dislikedBy || []), { id: user.id, name: user.fullName }] }
            : p
        )
      );
      notify(`${user.fullName} disliked ${post.user}'s post.`);
      await saveNotification(post.userId, `${user.fullName} disliked your post.`);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="container p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 mt-0">Explore</h1>
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
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbUpAltIcon
                      className={`text-blue-500 ${
                        post.likedBy?.some((u) => u.id === user.id) ? "text-blue-600" : ""
                      }`}
                    />
                    <span className="ml-1">{post.likes || 0}</span>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleDislike(post.id)}
                  >
                    <ThumbDownAltIcon
                      className={`text-red-500 ${
                        post.dislikedBy?.some((u) => u.id === user.id) ? "text-red-600" : ""
                      }`}
                    />
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
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  // Removed deleteDoc and doc imports since we won't be using them
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const POSTS_LIMIT = 5;

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [lastPost, setLastPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [reportPostId, setReportPostId] = useState(null); // State to track which post to report
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const observer = useRef(); // Ref for IntersectionObserver

  useEffect(() => {
    if (isLoaded) {
      if (!user) router.push("/welcome");
      else fetchInitialPosts();
    }
  }, [user, isLoaded, router]);

  const fetchInitialPosts = async () => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(POSTS_LIMIT)
    );
    const querySnapshot = await getDocs(q);
    const postsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPosts(postsData);
    setLastPost(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
    setHasMore(querySnapshot.size === POSTS_LIMIT);
  };

  const fetchMorePosts = async () => {
    if (!lastPost) return;

    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      startAfter(lastPost),
      limit(POSTS_LIMIT)
    );

    const querySnapshot = await getDocs(q);
    const newPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPosts((prev) => [...prev, ...newPosts]);
    setLastPost(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(querySnapshot.size === POSTS_LIMIT);
  };

  const lastPostRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMorePosts();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const notify = (message) => toast(message);

  const handleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    // Like logic here...
  };

  const handleDislike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    // Dislike logic here...
  };

  const handleReport = async () => {
    if (reportPostId) {
      // Here you can implement your reporting logic (e.g., send report to your server)
      // For example:
      // await reportPostToServer(reportPostId, user.id); // Pseudo function
      notify("Post reported successfully.");
      setReportPostId(null);
    }
  };

  const renderPostMenu = (post) => {
    // Check if the current user is the author of the post
    const isAuthor = user?.id === post.userId;

    // Debugging logs
    console.log("Current User ID:", user?.id);
    console.log("Post Author ID:", post.userId);
    console.log("Is Author:", isAuthor);

    return (
      <div className="absolute right-4 top-2">
        <MoreVertIcon
          onClick={() => setReportPostId(post.id)}
          className="cursor-pointer"
        />
        {reportPostId === post.id && ( // Show report option
          <div className="absolute bg-white border shadow-md rounded-md mt-2">
            <div
              onClick={handleReport}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              Report
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading... Just vibing in digital traffic. 🚦
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Explore</h1>
      </div>

      {/* Main Page Content */}
      <div className="w-full max-w-md p-6 space-y-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            className="relative p-4 bg-white shadow-md rounded-md"
          >
            {renderPostMenu(post)} {/* Pass the entire post object */}

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
                <ThumbUpAltIcon className="text-blue-500" />
                <span className="ml-1">{post.likes || 0}</span>
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleDislike(post.id)}
              >
                <ThumbDownAltIcon className="text-red-500" />
                <span className="ml-1">{post.dislikes || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

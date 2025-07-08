"use client";
import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";

const Actions  = ({ postId }) => {
  const { post } = useGetDetailsPost();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setLiked(!!post.isLiked);
      setLikesCount(post.likesCount ?? 0);
    }
  }, [post]);

  const toggleLike = async () => {
    if (loading) return;

    const wasLiked = liked;
    const delta = wasLiked ? -1 : +1;

    setLiked(!wasLiked);
    setLikesCount((c) => c + delta);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/like/toggleLikePost/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to toggle like");

      if (typeof data.isLiked === "boolean") setLiked(data.isLiked);
      if (typeof data.likesCount === "number") setLikesCount(data.likesCount);
    } catch (err) {
      setLiked(wasLiked);
      setLikesCount((c) => c - delta);
      console.error("toggleLike error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <div className="flex items-center justify-between pt-2 bg-white p-2 rounded-md mt-1 text-gray-600">
      <button
        onClick={toggleLike}
        disabled={loading}
        className="flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 disabled:opacity-50"
      >
        <ThumbsUp
          size={18}
          fill={liked ? "currentColor" : "none"}
          className={liked ? "text-blue-500" : ""}
        />
        <span>{liked ? "Unlike" : "Like"}</span>
        <span className="ml-1 text-sm text-gray-500">{likesCount}</span>
      </button>

      <button className="flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-100">
        <MessageCircle size={18} />
        <span>Comment {post.commentsCount}</span>
      </button>

      <button className="flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-100">
        <Share2 size={18} />
        <span>Share</span>
      </button>
    </div>
  );
};

export default Actions;

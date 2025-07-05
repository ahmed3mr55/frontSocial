"use client";
import React from "react";
import { useState, useEffect } from "react";
import Alert from "../../Alert";
import Spinner from "../../Spinner";
import { usePosts } from "@/app/context/PostContext";


const DeletePost = ({ postId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { deletePost } = usePosts();

  const handleDeletePost = async () => {
    setLoading(true);
    setError(null);
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/delete/${postId}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        credentials: "include",
      })
      const data = await req.json();
      if (!req.ok) {
        setError(data.message || "Failed to delete post");
        return;
      }
      deletePost(postId);
      onClose();
    } catch (error) {
      setError(error.message);
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-center text-red-600">
          Delete Post
        </h2>
        <p className="mb-4 text-center">
          Are you sure you want to delete this Post?
        </p>
        {error && <Alert type="error">{error}</Alert>}
        {loading && <Spinner />}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDeletePost}
            disabled={loading}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 text-white cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;

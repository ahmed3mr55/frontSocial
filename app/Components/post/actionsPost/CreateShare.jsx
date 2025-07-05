"use client";
import React from "react";
import { useState, useEffect } from "react";
import Alert from "../../Alert";
import Spinner from "../../Spinner";

const CreateShare = ({ onClose, postId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSharePost = async () => {
    setLoading(true);
    setError(null);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/share/create/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await req.json();
      if (!req.ok) {
        setError(data.message || "Failed to share post");
        return;
      }
      setLoading(false);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to share post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-center text-blue-600">
          Share Post
        </h2>
        {error && <Alert type="error">{error}</Alert>}
        {loading && <Spinner />}
        <h3>Are you sure you want to share this post?</h3>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSharePost}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 text-white"
          >
            {loading ? "Sharing..." : "Share Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateShare;

"use client";
import React from "react";
import Alert from "../../Alert";
import Spinner from "../../Spinner";
import { useState, useEffect } from "react";
import { usePosts } from "@/app/context/PostContext";

const EditPost = ({ onClose, originalBody, postId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [body, setBody] = useState(originalBody || "");
  const { updatePost } = usePosts();

  // detect change between current body and original
  const hasChanged = body !== (originalBody || "");
  useEffect(() => {
    setBody(originalBody || "");
  }, [originalBody]);


  const handleUpdatePost = async () => {
    if (!hasChanged) return;
    setLoading(true);
    setError(null);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/update/${postId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        }
      );
      const data = await req.json();
      if (!req.ok) {
        setError(data.message || "Failed to update post");
        setLoading(false);
        return;
      }
      updatePost(data.post);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to update post");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-center text-blue-600">
          Edit Post
        </h2>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {error && <Alert type="error">{error}</Alert>}
        {loading && <Spinner />}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdatePost}
            disabled={loading || !hasChanged}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 text-white"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;

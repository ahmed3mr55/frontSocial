"use client";
import React, { useState, useEffect } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";

const UpdateComment = ({ originalBody, commentId, onClose }) => {
  // initialize with original body
  const [body, setBody] = useState(originalBody || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateComment } = useGetDetailsPost();

  // detect change between current body and original
  const hasChanged = body !== (originalBody || "");

  // reset when originalBody prop changes
  useEffect(() => {
    setBody(originalBody || "");
  }, [originalBody]);

  const handleUpdateComment = async () => {
    if (!hasChanged) return; // safety
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/update/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update comment");
      updateComment(data.comment);
      onClose();
    } catch (err) {
      setError(err.message || "Error updating comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-center text-blue-600">
          Update Comment
        </h2>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {error && <Alert type="error" message={error} />}
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
            onClick={handleUpdateComment}
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

export default UpdateComment;

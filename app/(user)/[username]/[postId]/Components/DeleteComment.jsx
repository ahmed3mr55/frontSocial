"use client";
import React from "react";
import { useState } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";

const DeleteComment = ({commentId, onClose}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { deleteComment } = useGetDetailsPost();

  const handleDeleteComment = async () => {
    setLoading(true);
    setError(null);
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comment/delete/${commentId}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        credentials: "include",
      })
      const data = await req.json();
      if (req.ok) {
        deleteComment(commentId);
        onClose();
      } else {
        setError(data.message || "Failed to delete comment");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      
    }
  }
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-center text-red-600">
          Delete Comment
        </h2>
        <p className="mb-4 text-center">
          Are you sure you want to delete this Comment?
        </p>
        {error && <Alert type="error" message={error} />}
        {loading && <Spinner />}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteComment}
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

export default DeleteComment;

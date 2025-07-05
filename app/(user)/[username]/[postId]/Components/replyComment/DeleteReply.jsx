"use client";
import React from "react";
import { useState } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";
import { Trash2 } from "lucide-react";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";

const DeleteReply = ({ commentId, replyId }) => {
  const { deleteReply } = useGetDetailsPost();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

    const handleDeleteReply = async () => {
        setLoading(true);
        setError(null);
        try {
            const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/replyComment/comments/${commentId}/${replyId}/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            })
            const data = await req.json();
            if (req.ok) {
                deleteReply(commentId, replyId);
                setIsOpen(false);
            } else {
                setError(data.message || "Failed to delete reply");
            }
        } catch (error) {
            setError(error.message || "Failed to delete reply");
        } finally {
            setLoading(false);
            
        }
    }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold text-center text-red-600">
              Delete Reply
            </h2>
            <p className="mb-4 text-center">
              Are you sure you want to delete this reply?
            </p>
            {error && <Alert type="error" message={error} />}
            {loading && <Spinner />}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReply}
                disabled={loading}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 text-white cursor-pointer"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(true)} className="cursor-pointer">
        <Trash2 size={14} className="mr-1" color="red" />
      </button>
    </>
  );
};

export default DeleteReply;

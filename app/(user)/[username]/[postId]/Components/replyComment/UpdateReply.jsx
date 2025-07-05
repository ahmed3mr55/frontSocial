"use client";
import React from "react";
import { useState, useEffect } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";
import { Pencil } from "lucide-react";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";

const UpdateReply = ({ commentId, originalBody, replyId }) => {
    const [body, setBody] = useState(originalBody || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { updateReply } = useGetDetailsPost();

  const hasChanged = body !== (originalBody || "");

  useEffect(() => {
    setBody(originalBody || "");
  }, [originalBody]);

  const handleUpdateComment = async () => {
    if (!hasChanged) return;
    setLoading(true);
    setError(null);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/replyComment/comments/${commentId}/${replyId}/update`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        }
      );
      const res = await req.json();
      if (!req.ok) {
        setError(res.message || "Failed to update reply");
        setLoading(false);
        return;
      }
      updateReply(commentId, res.reply);
      setBody("");
      setIsOpen(false);
    } catch (error) {
      setError(error.message || "Failed to update reply");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold text-center text-blue-600">
              Eidt Reply
            </h2>
            <textarea
              className="w-full h-32 p-2 border border-gray-300 rounded"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              dir="auto"
            />
            {error && <Alert type="error" message={error}/>}
            {loading && <Spinner />}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className={`px-4 py-2 bg-gray-500 rounded cursor-pointer  hover:bg-gray-600 text-white disabled:cursor-not-allowed`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateComment}
                disabled={!hasChanged || loading}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex cursor-pointer items-center gap-2">
                    Save
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(true)} className="cursor-pointer">
        <Pencil size={14} className="mr-1" color="blue" />
      </button>
    </>
  );
};

export default UpdateReply;

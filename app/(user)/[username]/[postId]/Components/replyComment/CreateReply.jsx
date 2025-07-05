"use client";
import React from "react";
import { useState } from "react";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";
import { SendHorizontal } from "lucide-react";

const CreateReply = ({ commentId, firstName, lastName }) => {
  const { addReply } = useGetDetailsPost();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleReplyCreate = async () => {
    if (!body.trim()) {
      setError("Reply body cannot be empty");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/replyComment/comments/${commentId}/create`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        }
      );
      const res = await req.json();
      if (!req.ok) {
        setError(res.message || "Failed to create reply");
        setLoading(false);
        return;
      }
      addReply(commentId, res.reply);
      setBody("");
      setIsOpen(false);
    } catch (error) {
      setError(error.message || "Failed to create reply");
      setLoading(false);
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
              Reply to Comment by {firstName || ""}
            </h2>
            <textarea
              className="w-full h-32 p-2 border border-gray-300 rounded"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Reply to ${firstName || ""} ${lastName || ""}`}
              dir="auto"
            />
            {error && <Alert type="error" message={error} />}
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
                onClick={handleReplyCreate}
                disabled={loading || !body.trim()}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex cursor-pointer items-center gap-2">
                    <SendHorizontal size={16} />
                    Reply
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-gray-600 cursor-pointer text-sm"
      >
        Reply
      </button>
    </>
  );
};

export default CreateReply;

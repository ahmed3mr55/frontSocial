"use client";
import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import Spinner from "@/app/Components/Spinner";
import Alert from "@/app/Components/Alert";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";

const CreateComment = ({ postId }) => {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addComment } = useGetDetailsPost();
  const { user } = useUser();
  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/create/${postId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ body }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post comment");
      addComment(data.comment);
      setBody("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white flex items-center p-3 gap-3 border-t"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={user.profilePicture?.url || "/assets/iconUser.jpg"}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Input + Button group */}
      <div className="relative flex-1">
        <textarea
          value={body}
          dir="auto"
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="w-full h-12 resize-none border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className={`
            absolute right-1 top-1/2 -translate-y-1/2 overflow-hidden
            bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
            p-2 rounded-full text-white transition-opacity
            ${
              loading || !body.trim()
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100"
            }
          `}
        >
          {loading ? (
            <div className="flex items-center size-5 justify-center overflow-hidden">
              <Spinner />
            </div>
          ) : (
            <SendHorizontal size={18} />
          )}
        </button>
      </div>

      {/* Error */}
      {error && <Alert message={error} type="error" />}
    </form>
  );
};

export default CreateComment;

"use client";
import React, { useState } from "react";
import { X, LockKeyhole, LockOpen } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import Spinner from "../Spinner";
import { usePosts } from "@/app/context/PostContext";
import Alert from "../Alert";

const WinCreatePost = ({ onClose }) => {
  const [content, setContent] = useState("");
  const { addPost } = usePosts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useUser();
  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/create`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: trimmed }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        addPost(data.post);
        setSuccess(data.message || "Post created");
        onClose();
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md w-full max-w-md"
      >
        {/* Header */}
        <div className="relative flex items-center p-3 border-b">
          <h2 className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg">
            Create Post
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto p-2 bg-gray-200 cursor-pointer rounded-full"
          >
            <X size={25} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center p-4">
          <div className="w-11 h-11 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={user.profilePicture?.url || "/assets/iconUser.jpg"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h3 className="font-medium">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-500">{user.isPrivate ? <span className="flex items-center gap-1"><LockKeyhole size={16} /> followers only</span> : <span className="flex items-center gap-1"><LockOpen size={16} /> public</span>}</p>
          </div>
        </div>

        {/* Textarea */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 resize-none outline-none border-0 p-2 rounded-lg"
            placeholder="What's on your mind?"
            autoFocus
            required
            maxLength={1000}
            minLength={1}
            dir="auto"
          />
          {error && <Alert message={error} type="error" />}
          {success && <Alert message={success} type="success" />}
        </div>

        {/* Submit */}
        <div className="p-4">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-2 bg-blue-500 cursor-pointer text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WinCreatePost;

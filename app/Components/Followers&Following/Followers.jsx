// app/components/Following.jsx
"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Spinner from "../Spinner";
import Alert from "../Alert";
import Link from "next/link";
import DeleteFollower from "./DeleteFollower";
import { useUser } from "@/app/context/UserContext";

export default function Followers({ username, onClose, isProfile }) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();

  const [skip, setSkip] = useState(0);
  const limit = 3;

  const hasMore = followers.length >= limit + skip;

  const fetchFollowers = async (currentSkip = 0) => {
    setLoading(true);
    setError(null);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follow/followers/${username}?skip=${currentSkip}&limit=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await req.json();
      if (req.ok) {
        setFollowers((prev) =>
          currentSkip === 0 ? data.followers : [...prev, ...data.followers]
        );
      } else {
        setError(data.message || "Failed to fetch followers");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSkip(0);
    setFollowers([]);
    if (username) fetchFollowers();
  }, [username]);

  const handleLoadMore = () => {
    const nextSkip = skip + limit;
    setSkip(nextSkip);
    fetchFollowers(nextSkip);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md mx-4 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Followers</h2>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {loading && <Spinner />}
        {error && <Alert type="error" message={error} />}
        {followers.length === 0 && !loading && !error && (
          <div className="px-6 py-4">
            <p className="text-gray-500">No followers found</p>
          </div>
        )}
        <div className="max-h-96 overflow-y-auto">
          {followers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-gray-50 transition"
            >
              <Link href={`/${user.username}`} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={user.profilePicture?.url || "/assets/iconUser.png"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    {user.firstName || ""} {user.lastName || ""}
                  </span>
                  <span className="text-sm text-gray-500">
                    @{user.username || ""}
                  </span>
                </div>
              </Link>
              <div>
                {isProfile && (
                   <DeleteFollower followerId={user._id} username={username} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          {!loading && !error && hasMore && (
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load more
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";

const Follow = ({ username }) => {

  const [action, setAction]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getStatus = async () => {

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follow/getStatusFollowing/${username}`,
        { credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
        
      );
      const data = await res.json();
      if (res.ok) {
        setAction(data.action);
      } else {
        setError(data.message || "Failed to fetch status");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follow/toggleFollow/${username}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        await getStatus();
      } else {
        setError(data.message || "Failed to toggle follow");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStatus();
  }, [username]);

  const label = {
    follow:         "Follow",
    unfollow:       "Unfollow",
    send_request:   "Send Request",
    cancel_request: "Cancel Request",
  }[action] || "…";

  return (
    <div className="mt-4 self-center lg:self-auto">
      <button
        disabled={loading || !action}
        onClick={toggleFollow}
        className={`px-6 py-2 rounded-full text-white transition ${
          action === "unfollow" || action === "cancel_request"
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-blue-500 hover:bg-blue-600"
        } disabled:opacity-50`}
      >
        {loading ? <Spinner /> : label}
      </button>
      {error && <Alert type="error" message={error} />}
    </div>
  );
};

export default Follow;

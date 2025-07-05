"use client";
import React, { useState, useEffect } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";

const PrivateAccount = ({ isPrivate }) => {
  const [uprivate, setUprivate] = useState(isPrivate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Sync prop to state when it changes
  useEffect(() => {
    setUprivate(isPrivate);
  }, [isPrivate]);

  const handleTogglePrivate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/togglePrivate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setUprivate(prev => !prev);
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="p-2 bg-gray-50 flex flex-col gap-2 rounded hover:bg-gray-100">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-md font-semibold">Private Account</h3>
        <button
          disabled={loading}
          onClick={handleTogglePrivate}
          className="px-2 py-1 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? <Spinner /> : uprivate ? "On" : "Off"}
        </button>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <p className="text-sm text-gray-400">
        When enabled, your account will become private. Only your followers will
        be able to view your posts, like them, comment, and interact with you.
      </p>
    </div>
  );
};

export default PrivateAccount;

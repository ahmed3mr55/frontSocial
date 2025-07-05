"use client";
import React from "react";
import { useState, useEffect } from "react";
import Alert from "../Alert";
import Spinner from "../Spinner";

const DeleteFollower = ({ followerId, username }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follow/follower-delete/${followerId}/${username}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        throw new Error(data.message || "Failed to remove follower");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button disabled={loading || success} onClick={handleDelete} className="px-4 rounded-lg hover:bg-red-600 cursor-pointer py-2 bg-red-500 text-white" >
        {loading ? <Spinner /> : success ? "Removed" : "Remove"}
        {error && <Alert type="error" message={error} />}
      </button>
    </>
  );
};

export default DeleteFollower;

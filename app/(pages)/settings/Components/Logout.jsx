"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";

const Logout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Logout failed");
      }
      setIsOpenPopup(false);
      location.href = "/auth/login";
    } catch (error) {
      setError(error.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpenPopup && (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold text-center text-red-600">
              Logout Confirmation
            </h2>
            <p className="mb-4 text-center">
              Are you sure you want to logout ?
            </p>
            {error && <Alert type="error">{error}</Alert>}
            {loading && <Spinner />}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsOpenPopup(false)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 text-white cursor-pointer"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpenPopup(true)}
        className="p-2 bg-red-500 flex flex-col gap-2 w-full rounded hover:bg-red-600 cursor-pointer"
      >
        <span className="text-white flex items-center gap-2">
          Logout <LogOut size={20} />
        </span>
      </button>
    </>
  );
};

export default Logout;

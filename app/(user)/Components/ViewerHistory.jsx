// app/(main)/Components/ViewerHistory.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

const ViewerHistory = ({ onClose }) => {
  const {
    viewerHistory,
    loadingViewerHistory,
    errorViewerHistory,
    fetchViewerHistory,
    user,
  } = useUser();

  const [isEnabled, setIsEnabled] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState(null);

  // A ref to ensure we only fetch once per "open + enabled" cycle
  const fetchedRef = useRef(false);

  // 1) Sync `isEnabled` once, when `user` arrives
  useEffect(() => {
    if (typeof user?.enabledViewerHistory === "boolean") {
      setIsEnabled(user.enabledViewerHistory);
      fetchedRef.current = false; // reset so we can fetch if enabled
    }
  }, [user]);

  // 2) On mount / when isEnabled flips true for the first time, fetch once
  useEffect(() => {
    if (isEnabled && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchViewerHistory();
    }
  }, [isEnabled, fetchViewerHistory]);

  const handleToggle = async () => {
    setToggleLoading(true);
    setToggleError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/viewerHistory/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Toggle failed");
      setIsEnabled((v) => !v);
      // If turning on, allow a fresh fetch
      if (!isEnabled) {
        fetchedRef.current = false;
      }
    } catch (err) {
      setToggleError(err.message);
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">Viewer History</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Note + Toggle */}
        <div className="p-4 border-b">
          <p className="text-sm text-gray-500">
            <strong>Note:</strong> Enable this feature in your account settings.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-700 font-medium">Status:</span>
            <button
              onClick={handleToggle}
              disabled={toggleLoading}
              className={`px-3 py-1 text-white rounded-md transition ${
                isEnabled
                  ? "bg-green-500 hover:bg-green-400"
                  : "bg-red-500 hover:bg-red-400"
              }`}
            >
              {toggleLoading
                ? "Toggling..."
                : isEnabled
                ? "Enabled"
                : "Disabled"}
            </button>
          </div>
          {toggleError && (
            <Alert type="error" message={toggleError} className="mt-2" />
          )}
        </div>

        {/* Body */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {loadingViewerHistory ? (
            <Spinner />
          ) : errorViewerHistory ? (
            <Alert type="error" message={errorViewerHistory} />
          ) : !isEnabled ? (
            <p className="text-center text-gray-500">
              Viewer history is disabled.
            </p>
          ) : viewerHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div>
                <img className="w-full" src="/assets/404.png" alt="empty" />
              </div>
              <p className="text-gray-500 text-sm mt-2">
                No viewers found. Enable this feature in your account settings
                to start tracking viewers.
              </p>
            </div>
          ) : (
            viewerHistory.map((viewer) => {
              const u = viewer.user;
              return (
                <div key={viewer._id} className="flex items-center gap-3 mb-4">
                  <Link
                    href={`/${u.username}`}
                    className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={u.profilePicture?.url || "/assets/iconUser.png"}
                      alt={u.username}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <Link
                    href={`/${u.username}`}
                    className="flex flex-col flex-1"
                  >
                    <h4 className="font-bold text-gray-800">
                      {u.firstName} {u.lastName}
                    </h4>
                    <p className="text-gray-500 text-sm">@{u.username}</p>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewerHistory;

"use client";
import React, { useState, useEffect } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";

const FA2 = ({ twoFactorEnabled }) => {
  const [isEnabled, setIsEnabled] = useState(twoFactorEnabled);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Sync prop to state
  useEffect(() => {
    setIsEnabled(twoFactorEnabled);
  }, [twoFactorEnabled]);

  const toggle2FA = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/toggle-2fa`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setIsEnabled(prev => !prev);
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => { setError(null); setSuccess(null); }, 5000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  return (
    <div className="p-2 bg-gray-50 flex flex-col gap-2 rounded hover:bg-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Two-Factor Authentication</h3>
        <button
          onClick={toggle2FA}
          disabled={loading}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading
            ? <Spinner />
            : isEnabled
              ? "On"
              : "Off"}
        </button>
      </div>
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      <p className="text-sm text-gray-400">
        Adds extra security by requiring a code sent to your email upon login.
      </p>
    </div>
  );
};

export default FA2;

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Alert from "../Alert";
import Spinner from "../Spinner";
import NotFound from "../NotFound";

export default function ResetPassword({ id, token }) {
  const router = useRouter();

  // form state
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ui state
  const [email, setEmail] = useState("");
  const [errorCheckToken, setErrorCheckToken] = useState(null);
  const [errorReset, setErrorReset] = useState(null);
  const [successReset, setSuccessReset] = useState(null);
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // 1) Validate token on mount
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/password/reset-password/${id}/${token}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Token invalid or expired");
        }
        setEmail(data.email);
      } catch (err) {
        setErrorCheckToken(err.message);
      } finally {
        setLoadingCheck(false);
      }
    }
    check();
  }, [id, token]);

  // 2) Handler for actually resetting
  const handleReset = async () => {
    setLoadingReset(true);
    setErrorReset(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/password/reset-password/${id}/${token}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirmPassword: confirm }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset");
      setSuccessReset(data.message || "Password successfully reset!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setErrorReset(err.message);
    } finally {
      setLoadingReset(false);
    }
  };

  // 3) Render
  if (loadingCheck) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Spinner />
      </div>
    );
  }

  if (errorCheckToken) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  return (
    <div className="min-h-[91vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600">
          for <span className="font-medium text-gray-800">{email}</span>
        </p>

        <div className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pr-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 cursor-pointer top-[38px] text-gray-500"
            >
              {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full pr-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 cursor-pointer top-[38px] text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {errorReset && <Alert type="error" message={errorReset} />}
        {successReset && <Alert type="success" message={successReset} />}

        <button
          onClick={handleReset}
          disabled={loadingReset || !password || password !== confirm}
          className="w-full py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition"
        >
          {loadingReset ? <Spinner /> : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

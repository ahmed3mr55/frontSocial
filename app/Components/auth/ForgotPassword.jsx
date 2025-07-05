"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "../Alert";
import Spinner from "../Spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({
        loading: false,
        error: "Please enter your email",
        success: null,
      });
      return;
    }
    setStatus({ loading: true, error: null, success: null });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/password/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset link");
      setStatus({
        loading: false,
        error: null,
        success: "Reset link sent! Check your inbox.",
      });
      setTimeout(() => router.push("/auth/success"), 2000);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  };

  return (
    <div className="h-[90vh] w-full flex items-center justify-center bg-gradient-to-br bg-gray-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-800">
          Forgot Password
        </h2>

        {status.error && <Alert type="error" message={status.error} />}
        {status.success && <Alert type="success" message={status.success} />}

        <div>
          <label className="block mb-1 text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={status.loading || !email}
          className="w-full flex items-center cursor-pointer justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {status.loading ? <Spinner size="sm" /> : "Send Reset Link"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <button
            type="button"
            disabled={status.loading}
            onClick={() => router.push("/auth/login")}
            className="text-blue-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}

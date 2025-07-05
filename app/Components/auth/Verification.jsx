"use client";
import React, { useState, useRef } from "react";
import Cookies from "js-cookie";
import Alert from "../Alert";
import Spinner from "../Spinner";

const Verification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && inputsRef.current[idx + 1]) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      setError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const tempToken = Cookies.get("tempToken");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ otp: otp.join(""), tempToken }),
        }
      );
      const data = await res.json();
      if (res.ok && !data.twoFactorRequired) {
        setSuccess("OTP verified successfully! Redirecting…");
        Cookies.remove("tempToken");
        Cookies.set("userId", data.userId, { expires: 30 });
        setTimeout(() => (window.location.href = "/"), 1500);
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="lg:text-2xl md:text-2xl sm:text-xl text-lg font-semibold text-center mb-2">
        Verify Your Email
      </h2>
      <p className="text-center lg:text-base md:text-base sm:text-sm text-gray-600 mb-6">
        We've sent a 6‑digit code to your email. Please enter it below to
        continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          ))}
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 cursor-pointer bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Spinner /> : "Verify OTP"}
        </button>
      </form>

      <div className="text-center mt-4">
        <button className="text-indigo-600 hover:underline">
          Resend Code
        </button>
      </div>
    </div>
  );
};

export default Verification;

"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessSendEmail() {
  return (
    <div className="min-h-[91vh] flex items-center justify-center bg-gradient-to-br from-green-200 to-green-400 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4 max-w-sm text-center">
        <CheckCircle size={64} className="text-green-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Email Sent Successfully!
        </h2>
        <p className="text-gray-600">
          We've sent you a password reset link. Please check your inbox.
        </p>
        <button
          onClick={() => window.location.href = "/auth/login"}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

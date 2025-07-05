"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";

const UpdatePassword = ({ onClose, onSave }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const changed =
      password.trim() !== "" ||
      logoutAllDevices;
    setIsModified(changed);
  }, [password, logoutAllDevices]);

  const handleSave = async () => {
    setError(null);
    setLoading(true);

    try {
      // جهّز الـ payload بناءً على الحقول التي غيّرها المستخدم
      const payload = {};
      if (password.trim() !== "") payload.password = password;
      if (logoutAllDevices) payload.tokenVersion  = true;

      if (Object.keys(payload).length > 0) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Server error");
        setSuccess(result.message || "Password updated successfully");
      } else {
        setSuccess("No changes to save.");
      }

      // أغلق النافذة بعد ثانيتين مثلاً
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Update Password</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* حقل كلمة المرور الجديد */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter new password"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
                className="mr-2"
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="logoutAllDevices"
                checked={logoutAllDevices}
                onChange={() => setLogoutAllDevices((prev) => !prev)}
                className="mr-2"
              />
              <label htmlFor="logoutAllDevices">
                Logout All Devices and logout this device
              </label>
            </div>
          </div>

          {error && <Alert type={"error"} message={error} />}
          {success && <Alert type={"success"} message={success} />}

          {/* زر الحفظ */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isModified || loading}
              className={`${
                isModified
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } font-medium py-2 px-6 rounded-full transition flex items-center`}
            >
              {loading ? <Spinner /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;

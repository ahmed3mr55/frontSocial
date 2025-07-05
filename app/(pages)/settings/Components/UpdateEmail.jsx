"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Alert from "@/app/Components/Alert";
import { useUser } from "@/app/context/UserContext";

const UpdateEmail = ({ initialEmail = "", onClose, onSave }) => {
  const [email, setEmail] = useState(initialEmail);
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser();

  // Detect if form modified
  useEffect(() => {
    setIsModified(email !== initialEmail);
  }, [email, initialEmail]);

  const handleSave = () => {
    if (isModified) onSave({ email });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );
      const data = await req.json();
      if (!req.ok) throw new Error(data.message);
      updateUser(data.user);
      setSuccess(data.message);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden"
        >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Update Email</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
            >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
              />
          </div>

              {error && <Alert type="error" message={error} />}
              {success && <Alert type="success" message={success} />}
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isModified || loading}
              className={`${
                isModified
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } font-medium py-2 px-6 rounded-full transition`}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmail;

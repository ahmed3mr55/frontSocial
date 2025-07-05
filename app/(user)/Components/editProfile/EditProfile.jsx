"use client";
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Alert from "@/app/Components/Alert";
import { useUser } from "@/app/context/UserContext";

const EditProfile = ({ user, onClose, onSave }) => {
  const [preview, setPreview] = useState(user.avatarUrl || "/assets/ahmed.jpg");
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser();

  const [isModified, setIsModified] = useState(false);
  const inputRef = useRef();

  // الدوال المساعدة لتعديل الحقول
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);

  const handleImageClick = () => inputRef.current.click();
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  useEffect(() => {
    const changed =
      firstName !== (user.firstName || "") ||
      lastName !== (user.lastName || "") ||
      username !== (user.username || "") ||
      bio !== (user.bio || "") ||
      file !== null;
    setIsModified(changed);
  }, [firstName, lastName, username, bio, file, user]);

 
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const payload = {};

    if (firstName !== user.firstName) payload.firstName = firstName;
    if (lastName !== user.lastName) payload.lastName = lastName;
    if (username !== user.username) payload.username = username;
    if (bio !== user.bio) payload.bio = bio;

    try {
      let updatedUser;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/uploadProfilePicture`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || "Failed to upload avatar");
        }
        payload.image = uploadData.url;
      }

      if (Object.keys(payload).length > 0) {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );
        const data = await req.json();
        if (!req.ok) throw new Error(data.message || "Failed to update");

        updatedUser = data.user;
      } else {
        setSuccess("No changes to save");
        setLoading(false);
        return;
      }

      updateUser(updatedUser);
      setSuccess("Profile updated successfully");
      onSave(updatedUser);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div
              onClick={handleImageClick}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden cursor-pointer ring-2 ring-white shadow-sm"
            >
              <img
                src={preview}
                alt="avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {file && (
              <button
                onClick={handleSave}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={handleFirstNameChange}
                className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
                className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={handleBioChange}
                rows={3}
                className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                dir="auto"
              />
            </div>
          </div>

          {/* Save All */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isModified}
              className={`${
                isModified
                  ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white font-medium py-2 px-6 rounded-full transition`}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

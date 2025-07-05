"use client";
import React, { useState } from "react";
import { BadgeCheck, Pencil } from "lucide-react";
import EditProfile from "../editProfile/EditProfile";
import Follow from "../Follow";
import Following from "@/app/Components/Followers&Following/Following";
import Followers from "@/app/Components/Followers&Following/Followers";

const ProfileHeader = ({
  username,
  firstName,
  lastName,
  bio,
  avatarUrl,
  followers = 123,
  following = 456,
  isprofile,
  isVrified,
}) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [isOpenFollowers, setIsOpenFollowers] = useState(false);
  const [isOpenFollowing, setIsOpenFollowing] = useState(false);

  return (
    <header className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Blue banner */}
      <div className="h-32 bg-blue-500 relative">
        <div className="absolute left-6 right-6 bottom-[-3rem] size-28 sm:size-28 md:size-32 lg:size-35 rounded-full border-4 border-white overflow-hidden bg-gray-200">
          <img
            src={avatarUrl}
            alt={`${firstName} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Edit Profile button */}
        {isOpenEdit && (
          <EditProfile
            user={{ firstName, lastName, username, bio, avatarUrl }}
            onClose={() => setIsOpenEdit(false)}
            onSave={(data) => {
              console.log("Saved data:", data);
              setIsOpenEdit(false);
            }}
          />
        )}
        {isprofile && (
          <button
            onClick={() => setIsOpenEdit(true)}
            className="absolute right-6 top-8 bg-white text-blue-600 hover:bg-blue-200 cursor-pointer font-medium py-2 px-4 rounded-full transition flex items-center gap-1"
          >
            <Pencil size={18} /> Edit
          </button>
        )}
      </div>

      {/* Main content: name on far left under avatar, follow on far right */}
      <div className="px-6 pt-16 pb-6 flex justify-between items-start">
        {/* Left side: name and username */}
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold flex items-center gap-1 text-gray-800">
            {`${firstName} ${lastName}`} {isVrified && <BadgeCheck color="blue" size={18} />}
          </h1>
          <p className="text-gray-500 text-sm mt-1">@{username}</p>
        </div>

        {/* Right side: Follow or Edit button */}
        {!isprofile && (
          <div>
            <Follow username={username} />
          </div>
        )}
      </div>

      {/* Stats: Followers / Following */}
      <div className="px-6 pb-4 flex flex-row items-center gap-8">
        {isOpenFollowing && (
          <Following username={username} onClose={() => setIsOpenFollowing(false)} />
        )}
        {isOpenFollowers && (
          <Followers username={username} isProfile={isprofile} onClose={() => setIsOpenFollowers(false)} />
        )}
        <div onClick={() => setIsOpenFollowers(true)} className="text-center cursor-pointer hover:text-blue-500">
          <span className="block text-xl font-bold text-gray-800">{followers}</span>
          <span className="text-gray-500 text-sm">Followers</span>
        </div>
        <div onClick={() => setIsOpenFollowing(true)} className="text-center cursor-pointer hover:text-blue-500">
          <span  className="block text-xl font-bold text-gray-800">{following}</span>
          <span className="text-gray-500 text-sm">Following</span>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;

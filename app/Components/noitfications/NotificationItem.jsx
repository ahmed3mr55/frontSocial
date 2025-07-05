"use client";
import React from "react";
import { formatPostDate } from "@/app/utils/formatDate";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationItem({
  firstName,
  lastName,
  profilePicture,
  date,
  message,
  unread,
  username,
  link,
  type,
}) {
  const router = useRouter();

  const handleLink = (link, type, username) => {
    if (type === "like") {
      router.push(`/${username}/${link}`);
    }else if (type === 'follow') {
      router.push(`/${username}`);
    }else if (type === 'comment' || type === 'reply') {
      router.push(`/${username}/${link}`);
    }
    
  };

  return (
    <div
      className={`flex items-start gap-2 p-6 transition-colors ${
        unread ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <Link
        href={`/${username}`}
        className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
      >
        <img
          src={profilePicture || "/assets/iconUser.png"}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <Link href={`/${username}`} className="font-medium text-gray-900">
            {firstName} {lastName}
          </Link>
          <span className="text-xs text-gray-400">{formatPostDate(date)}</span>
        </div>
        <button
          onClick={() => handleLink(link, type, username)}
          className="mt-1 text-gray-700 cursor-pointer hover:underline"
        >
          {message}
        </button>
      </div>
    </div>
  );
}

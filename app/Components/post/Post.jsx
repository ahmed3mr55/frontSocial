"use client";
import React, { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  BadgeCheck,
  Ellipsis,
} from "lucide-react";
import Link from "next/link";
import DeletePost from "./actionsPost/DeletePost";
import EditPost from "./actionsPost/EditPost";

export default function Post({
  postId,
  imgURL,
  firstName,
  lastName,
  username,
  date,
  body,
  likes,
  comments,
  verified,
  isLiked: initialLiked,
  currentUser,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenShare, setIsOpenShare] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleLike = async () => {
    const wasLiked = liked;
    const delta = wasLiked ? -1 : +1;
    setLiked(!wasLiked);
    setLikesCount(c => c + delta);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/like/toggleLikePost/${postId}`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error();
    } catch {
      setLiked(wasLiked);
      setLikesCount(c => c - delta);
    }
  };

  return (
    <div className="bg-white p-3 mb-4 rounded-lg shadow-md flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Link href={`/${username}`} className="w-11 h-11 rounded-full overflow-hidden bg-gray-200">
            <img
              src={imgURL || "/assets/iconUser.png"}
              alt={username}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </Link>
          <div>
            <Link href={`/${username}`} className="font-bold flex items-center gap-1">
              {firstName} {lastName}
              {verified && <BadgeCheck size={17} className="text-blue-500" />}
            </Link>
            <span className="text-gray-500 text-sm">{date}</span>
          </div>
        </div>

        {username === currentUser && (
          <div className="relative">
            <button onClick={() => setShowMenu(v => !v)}>
              <Ellipsis size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => { setIsOpenEdit(true); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => { setIsOpenDelete(true); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {isOpenDelete && <DeletePost postId={postId} onClose={() => setIsOpenDelete(false)} />}
      {isOpenEdit   && <EditPost   postId={postId} originalBody={body} onClose={() => setIsOpenEdit(false)} />}

      {/* Content */}
      <Link href={`/${username}/${postId}`} className="cursor-pointer">
        <p dir="auto" className="text-gray-800">{body}</p>
      </Link>

      {/* Stats */}
      <div className="flex gap-6 text-gray-600 text-sm">
        <span>{likesCount} Likes</span>
        <span>{comments} Comments</span>
      </div>

      {/* Actions */}
      <div className="flex justify-between border-t pt-2">
        <button
          onClick={toggleLike}
          className="flex items-center cursor-pointer gap-1 py-1 px-2 hover:bg-gray-100 rounded"
        >
          <ThumbsUp
            size={18}
            fill={liked ? "currentColor" : "none"}
            className={liked ? "text-blue-500" : ""}
          />
          <span>{liked ? "Unlike" : "Like"}</span>
        </button>
        <Link href={`/${username}/${postId}`}  className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 rounded">
          <MessageCircle size={18} /> Comment
        </Link>
        <button
          className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 rounded"
        >
          <Share2 size={18} /> Share
        </button>
      </div>
    </div>
  );
}

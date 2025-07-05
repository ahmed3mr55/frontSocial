"use client";
import React, { useState } from "react";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";
import { useUser } from "@/app/context/UserContext";
import { formatPostDate } from "@/app/utils/formatDate";
import { Trash2, BadgeCheck,  Pencil, Reply as ReplyIcon } from "lucide-react";
import Link from "next/link";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import ReplyComment from "./replyComment/ReplyComment";
import CreateReply from "./replyComment/CreateReply";

export default function Details() {
  const {
    comments,
    fetchReplies,
    loadingReplies,
    hasMoreMap,
  } = useGetDetailsPost();
  const { user } = useUser();

  // track which comments have their replies panel open
  const [visibleReplies, setVisibleReplies] = useState({});

  const toggleReplies = (commentId) => {
    const show = !visibleReplies[commentId];
    setVisibleReplies((prev) => ({ ...prev, [commentId]: show }));
    if (show) {
      fetchReplies(commentId);
    }
  };

  // track which comment is being deleted or edited
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);

  return (
    <div className="bg-white overflow-y-auto rounded-md mt-2 mb-2 p-2 h-[45vh]">
      <h3 className="font-bold text-center text-md mb-4">Comments</h3>

      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-100 mb-4 p-3 rounded-lg">
          {/* Comment Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Link
                href={`/${comment.user.username}`}
                className="w-9 h-9 rounded-full overflow-hidden bg-gray-200"
              >
                <img
                  src={
                    comment.user.profilePicture?.url || "/assets/iconUser.png"
                  }
                  alt={comment.user.username}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div>
                <Link
                  href={`/${comment.user.username}`}
                  className="font-bold flex items-center text-sm"
                >
                  {comment.user.firstName} {comment.user.lastName} {comment.user.verified && <BadgeCheck className="ml-1" color="blue" size={15} />}
                </Link>
                <p className="text-gray-500 text-xs">
                  {formatPostDate(comment.createdAt)}
                </p>
              </div>
            </div>
            {/* Actions */}
            {user?._id === comment.user._id && (
              <div className="flex gap-2">
                {deletingCommentId === comment._id && (
                  <DeleteComment
                    commentId={comment._id}
                    onClose={() => setDeletingCommentId(null)}
                  />
                )}
                <button
                  onClick={() => setDeletingCommentId(comment._id)}
                  className="p-1 hover:bg-red-200 rounded-full"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>

                {editingCommentId === comment._id && (
                  <UpdateComment
                    commentId={comment._id}
                    originalBody={comment.body}
                    onClose={() => setEditingCommentId(null)}
                  />
                )}
                <button
                  onClick={() => setEditingCommentId(comment._id)}
                  className="p-1 hover:bg-blue-200 rounded-full"
                >
                  <Pencil size={16} className="text-blue-600" />
                </button>
              </div>
            )}
          </div>

          {/* Comment Body */}
          <p dir="auto" className="mt-2 text-sm text-gray-800">{comment.body}</p>

          {/* Show / Hide Replies Toggle */}
          <div className="mt-3 flex gap-4 items-center">
            <button
              onClick={() => toggleReplies(comment._id)}
              className="mt-3 text-sm text-gray-600 hover:text-gray-700 cursor-pointer hover:underline flex items-center gap-1"
            >
              <ReplyIcon size={16} />
              {visibleReplies[comment._id] ? "Hide replies" : "Show replies"}
            </button>
            <div className="ml-auto">
              {/* Only show reply button if user is logged in */}
              {user && (
                <CreateReply commentId={comment._id} firstName={comment.user.firstName} lastName={comment.user.lastName} />
              )}
            </div>
          </div>

          {/* Replies Section */}
          {visibleReplies[comment._id] && (
            <div className="mt-2 pl-4 border-l border-gray-200">
              <ReplyComment commentId={comment._id} />

              {/* Load more replies */}
              {hasMoreMap[comment._id] && (
                <button
                  onClick={() => fetchReplies(comment._id)}
                  disabled={loadingReplies[comment._id]}
                  className="mt-2 text-sm cursor-pointer text-blue-600 hover:underline"
                >
                  {loadingReplies[comment._id]
                    ? "Loading..."
                    : "Load more replies"}
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {comments.length === 0 && (
        <p className="text-center text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}

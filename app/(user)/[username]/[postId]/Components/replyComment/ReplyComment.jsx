"use client";
import React, { useEffect } from "react";
import { useGetDetailsPost } from "@/app/context/GetPostDetails";
import { useUser } from "@/app/context/UserContext";
import Spinner from "@/app/Components/Spinner";
import Alert from "@/app/Components/Alert";
import { Trash2, Pencil, BadgeCheck } from "lucide-react";
import { formatPostDate } from "@/app/utils/formatDate";
import Link from "next/link";
import UpdateReply from "./UpdateReply";
import DeleteReply from "./DeleteReply";

export default function ReplyComment({ commentId }) {
  const { user } = useUser();
  const { fetchReplies, repliesMap, loadingReplies, errorReplies } =
    useGetDetailsPost();

  useEffect(() => {
    if (commentId && repliesMap[commentId] === undefined) {
      fetchReplies(commentId);
    }
  }, [commentId]);

  const replies = repliesMap[commentId] || [];
  const isLoading = loadingReplies[commentId];
  const fetchError = errorReplies[commentId];

  if (fetchError) return <Alert type="error" message={fetchError} />;
  if (!isLoading && replies.length === 0) {
    return <p className="text-gray-500 text-sm">No replies yet</p>;
  }

  return (
    <div className="mt-2 space-y-2">
      {replies.map((reply) => (
        <div key={reply._id} className="bg-gray-50 p-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={`/${reply?.user.username}`} className="size-9 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={reply.user.profilePicture?.url || "/assets/iconUser.png"}
                  alt={reply.user.username}
                  className="w-full rounded-full object-cover"
                />
              </Link>
              <div className="flex flex-col">
                <Link href={`/${reply?.user.username}`} className="font-medium text-md flex items-center">
                  {reply.user.firstName} {reply.user.lastName} {reply.user.verified && <BadgeCheck className="ml-1" color="blue" size={14} />}
                </Link>
                <span className="text-gray-500 text-sm">{formatPostDate(reply.createdAt)}</span>
              </div>
            </div>
            <div className="flex gap-1">
              {user?._id === reply.user._id && (
                <>
                  <UpdateReply commentId={commentId} replyId={reply._id} originalBody={reply.body} />
                  <DeleteReply commentId={commentId} replyId={reply._id} />
                </>
              )}
            </div>
          </div>
          <p dir="auto" className="mt-1 text-gray-700">{reply.body}</p>
        </div>
      ))}

      {isLoading && <Spinner />}
    </div>
  );
}

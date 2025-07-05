// app/(main)/PostList.jsx
"use client";
import React, { useRef, useCallback } from "react";
import CreatePost from "../post/CreatePost";
import Post from "../post/Post";
import Alert from "../Alert";
import Spinner from "../Spinner";
import { usePosts } from "@/app/context/PostContext";
import { formatPostDate } from "@/app/utils/formatDate";
import { useUser } from "@/app/context/UserContext";

export default function PostList() {
  const { posts, loading, error, fetchMore } = usePosts();
  const { user } = useUser();
  const observer = useRef();

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, fetchMore]
  );

  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="mt-6 w-full overflow-hidden lg:mx-32 md:mx-10 sm:mx-5 mx-0">
      <CreatePost />

      {!loading && posts.length === 0 && (
        <Alert key="empty" type="warning" message="No posts found" />
      )}

      {posts.map((post, i) => {
        const isLast = i === posts.length - 1;
        const actionId =
          post.type === "share" ? post.shareId : post._id.toString();
        const originalId =
          post.type === "share" ? post.postId.toString() : post._id.toString();

        return (
          <div
            key={`${actionId}-${i}`}
            ref={isLast ? lastPostRef : undefined}
            className={isLast ? "overflow-hidden" : ""}
          >
            <Post
              type={post.type}
              sharedBy={post.type === "share" ? post.sharedBy : undefined}
              content={post.type === "share" ? post.content : undefined}
              postId={originalId} // always original post ID
              idForActions={actionId} // ID for like/comment
              imgURL={post.user.profilePicture.url}
              firstName={post.user.firstName}
              lastName={post.user.lastName}
              username={post.user.username}
              date={formatPostDate(post.createdAt)}
              body={post.body}
              likes={post.likesCount}
              comments={post.commentsCount}
              verified={post.user.verified}
              isLiked={post.isLiked}
              isPostDetails={true}
              currentUser={user?.username}
            />
          </div>
        );
      })}

      {loading && <Spinner key="spinner" />}
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Post from "@/app/Components/post/Post";
import Alert from "@/app/Components/Alert";
import { formatPostDate } from "@/app/utils/formatDate";

const PAGE_SIZE = 10;

const PostList = ({ username }) => {
  const [posts, setPosts]     = useState([]);
  const [skip, setSkip]       = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

const fetchMore = useCallback(async () => {
  if (loading || !hasMore) return;
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/post/${username}?limit=${PAGE_SIZE}&skip=${skip}`,
      { credentials: "include" }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch posts");

    setPosts(prev => {
      const newPosts = data.posts.filter(p => !prev.some(x => x._id === p._id));
      return [...prev, ...newPosts];
    });
    setHasMore(data.posts.length === PAGE_SIZE);
    setSkip(prev => prev + PAGE_SIZE);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [username, skip, loading, hasMore]);


  useEffect(() => {
    setPosts([]);
    setSkip(0);
    setHasMore(true);
    fetchMore();
  }, [username]);

  const observer = useRef();
  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchMore]);

  return (
    <>
      {posts.map((post, idx) => {
        const isLast = idx === posts.length - 1;
        return (
          <div key={post._id} ref={isLast ? lastPostRef : null}>
            <Post
              postId={post._id}
              imgURL={post.user.profilePicture.url}
              firstName={post.user.firstName}
              lastName={post.user.lastName}
              username={post.user.username}
              date={formatPostDate(post.createdAt)}
              body={post.body}
              likes={post.likesCount}
              comments={post.commentsCount}
              isLiked={post.isLiked}
              verified={post.user.verified}
              isPostDetails={true}
            />
          </div>
        );
      })}

      {loading && <div className="text-center py-4">Loading more…</div>}
      {error   && <Alert type="error" message={error} />}
      {!hasMore && !loading && <div className="text-center py-4">No more posts</div>}
    </>
  );
};

export default PostList;

// app/context/GetPostDetails.jsx
"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const GetDetailsPostContext = createContext();

export const GetDetailsPostProvider = ({ children, postId }) => {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [errorPost, setErrorPost] = useState(null);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState(null);

  const [repliesMap, setRepliesMap] = useState({}); // { [commentId]: [replies] }
  const [loadingReplies, setLoadingReplies] = useState({}); // { [commentId]: bool }
  const [errorReplies, setErrorReplies] = useState({}); // { [commentId]: err }
  const [skipMap, setSkipMap] = useState({}); // { [commentId]: number }
  const [hasMoreMap, setHasMoreMap] = useState({}); // { [commentId]: bool }

  const fetchPost = async (id) => {
    setLoadingPost(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/getPost/${id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPost(data.post);
    } catch (err) {
      setErrorPost(err.message);
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchComments = async (id) => {
    setLoadingComments(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/getAll/${id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setComments(data.comments);
    } catch (err) {
      setErrorComments(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchReplies = useCallback(
    async (commentId) => {
      const currentSkip = skipMap[commentId] || 0;
      const limit = 3;

      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
      setErrorReplies((prev) => ({ ...prev, [commentId]: null }));

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/replyComment/comments/${commentId}/replies?skip=${currentSkip}&limit=${limit}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setRepliesMap((prev) => ({
          ...prev,
          [commentId]:
            currentSkip === 0
              ? data.replies
              : [...(prev[commentId] || []), ...data.replies],
        }));
        setSkipMap((prev) => ({
          ...prev,
          [commentId]: currentSkip + data.replies.length,
        }));
        setHasMoreMap((prev) => ({
          ...prev,
          [commentId]: data.pagination.hasMore,
        }));
      } catch (err) {
        setErrorReplies((prev) => ({ ...prev, [commentId]: err.message }));
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [skipMap]
  );

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
      fetchComments(postId);
    }
  }, [postId]);

  const addComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };
  const deleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };
  const updateComment = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
    );
  };
  const addReply = (commentId, newReply) => {
    setRepliesMap((prev) => {
      const existing = prev[commentId] || [];
      if (existing.some((r) => r._id === newReply._id)) {
        return prev;
      }
      return {
        ...prev,
        [commentId]: [newReply, ...existing],
      };
    });
  };
  const deleteReply = (commentId, replyId) => {
    setRepliesMap((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || []).filter((r) => r._id !== replyId),
    }));
  };
  const updateReply = (commentId, updatedReply) => {
    setRepliesMap((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || []).map((r) =>
        r._id === updatedReply._id ? updatedReply : r
      ),
    }));
  };

  return (
    <GetDetailsPostContext.Provider
      value={{
        post,
        loadingPost,
        errorPost,
        comments,
        loadingComments,
        errorComments,
        fetchReplies,
        repliesMap,
        loadingReplies,
        errorReplies,
        hasMoreMap,
        addComment,
        deleteComment,
        updateComment,
        addReply,
        deleteReply,
        updateReply,
      }}
    >
      {children}
    </GetDetailsPostContext.Provider>
  );
};

export const useGetDetailsPost = () => useContext(GetDetailsPostContext);

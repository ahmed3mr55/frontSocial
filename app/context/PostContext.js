// PostsContext.js
"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const PostsContext = createContext();
const PAGE_SIZE = 10;

export const PostsContextProvider = ({ children }) => {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [skip, setSkip]       = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/getAll?limit=${PAGE_SIZE}&skip=${skip}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch failed");

      setPosts(prev => {
        const newOnly = data.posts.filter(
          p => !prev.some(x => x._id === p._id)
        );
        return [...prev, ...newOnly];
      });
      setHasMore(data.posts.length === PAGE_SIZE);
      setSkip(prev => prev + PAGE_SIZE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, skip]);

  useEffect(() => {
    fetchMore();
  }, []);

  const addPost = post => setPosts(prev => [post, ...prev]);
  const updatePost = updatedPost => {
    setPosts(prev =>
      prev.map(p => (p._id === updatedPost._id ? updatedPost : p))
    );
  };
  const deletePost = postId => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  return (
    <PostsContext.Provider value={{ posts,addPost, loading, error, fetchMore, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);

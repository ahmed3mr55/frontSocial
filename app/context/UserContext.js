"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Requests Following
  const [requestsFollowing, setRequestsFollowing] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState(null);

  // Viewer History
  const [viewerHistory, setViewerHistory] = useState([]);
  const [loadingViewerHistory, setLoadingViewerHistory] = useState(false);
  const [errorViewerHistory, setErrorViewerHistory] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [errorNotifications, setErrorNotifications] = useState(null);
  const [notifPagination, setNotifPagination] = useState({
    skip: 0,
    limit: 10,
    fetched: 0,
  });


  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setError(data.message || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/link/user`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setLinks(data.links);
      } else {
        setError(data.message || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestsFollowing = async () => {
    setErrorRequests(null);
    setLoadingRequests(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/followRequest/requests`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await res.json();
    if (res.ok) {
      setRequestsFollowing(data.requests);
    } else {
      setErrorRequests(data.message || "Failed to fetch user data");
    }
    setLoadingRequests(false);
  };

  const fetchViewerHistory = async () => {
    setErrorViewerHistory(null);
    setLoadingViewerHistory(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/viewerHistory`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setViewerHistory(data.viewerHistory);
      } else {
        setErrorViewerHistory(data.message || "Failed to fetch viewer history");
      }
    } catch (err) {
      console.error("Error fetching viewer history:", err);
      setErrorViewerHistory(err.message);
    } finally {
      setLoadingViewerHistory(false);
    }
  };

  const fetchNotifications = async (more = false) => {
    setErrorNotifications(null);
    setLoadingNotifications(true);
    try {
      const { skip, limit } = notifPagination;
      const actualSkip = more ? skip + notifPagination.fetched : 0;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notification/all?limit=${limit}&skip=${actualSkip}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorNotifications(data.message);
      }
      setNotifications((prev) =>
        more ? [...prev, ...data.notifications] : data.notifications
      );
      setNotifPagination({
        skip: actualSkip,
        limit,
        fetched: data.notifications.length,
      });
    } catch (err) {
      setErrorNotifications(err.message);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLinks();
    fetchRequestsFollowing();
  }, []);

  const updateUser = (updateUser) => setUser(updateUser);
  const deleteLink = (id) => setLinks(links.filter((link) => link._id !== id));
  const updateLink = (link) =>
    setLinks(links.map((l) => (l._id === link._id ? link : l)));
  const addLink = (link) => setLinks((prev) => [...prev, link]);
  const removeRequest = (id) =>
    setRequestsFollowing(
      requestsFollowing.filter((request) => request._id !== id)
    );

  return (
    <UserContext.Provider
      value={{
        user,
        links,
        removeRequest,
        requestsFollowing,
        fetchRequestsFollowing,
        loadingRequests,
        errorRequests,
        updateUser,
        loading,
        error,
        deleteLink,
        updateLink,
        addLink,
        fetchViewerHistory,
        viewerHistory,
        loadingViewerHistory,
        errorViewerHistory,
        fetchNotifications,
        notifPagination,
        notifications,
        loadingNotifications,
        errorNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

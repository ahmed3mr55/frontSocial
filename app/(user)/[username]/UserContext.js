"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const UserAppContext = createContext();

export function UserAppProvider({ children, username }) {
  // User
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Links
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [errorLinks, setErrorLinks] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function loadUser() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${username}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();

        if (res.status === 401) {
          setUser(null);
          setLoading(false);
          return;
        }
        if (res.status === 404) {
          setUser(null);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error(data.message || "Failed to fetch user");
        setUser(data.user);
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function loadLinks() {
      setLoadingLinks(true);
      setErrorLinks(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/link/${username}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setErrorLinks(data.message || "Failed to fetch links");
          setLoadingLinks(false);
          return;
        };
        setLinks(data.links);
      } catch (err) {
        setErrorLinks(err.message || "Failed to fetch links");
      } finally {
        setLoadingLinks(false);
      }
    }

    loadUser();
    loadLinks();
  }, [username]);

  return (
    <UserAppContext.Provider value={{ user, links, loading, error, loadingLinks, errorLinks }}>
      {children}
    </UserAppContext.Provider>
  );
}

export function useUserApp() {
  return useContext(UserAppContext);
}

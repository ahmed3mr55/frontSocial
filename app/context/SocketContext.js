// app/context/SocketContext.jsx
"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io as ioClient } from "socket.io-client";
import Cookies from "js-cookie";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = ioClient(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(" Socket connected, id:", socket.id);
      const userId = Cookies.get("userId");
      if (userId) {
        console.log("→ registering userId:", userId);
        socket.emit("register", userId);
      }
    });
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    socket.on("newNotification", (notif) => {
      console.log(" NewNotification received:", notif);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

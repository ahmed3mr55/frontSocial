// app/ClientProviders.jsx
"use client";
import React from "react";
import { SocketProvider } from "@/app/context/SocketContext";
import { UserProvider }   from "@/app/context/UserContext";

export default function ClientProviders({ children }) {
  return (
    <SocketProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SocketProvider>
  );
}

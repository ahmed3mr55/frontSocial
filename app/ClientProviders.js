// app/ClientProviders.jsx
"use client";
import React from "react";
import { UserProvider }   from "@/app/context/UserContext";

export default function ClientProviders({ children }) {
  return (
      <UserProvider>
        {children}
      </UserProvider>
  );
}

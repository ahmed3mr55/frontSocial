import React from "react";
import { UserAppProvider } from "./UserContext";

export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `Profile of ${username}`,
    description: `Welcome to ${username}'s profile page`,
  };
}

export default async function RootLayout({ children, params }) {
  const { username } = await params;
  return <UserAppProvider username={username}>{children}</UserAppProvider>;
}
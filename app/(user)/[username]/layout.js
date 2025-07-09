import React from "react";
import { UserAppProvider } from "./UserContext";

export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `Profile of ${username} | A Social`,
    description: `Welcome to ${username}'s profile page on A Social Media Platform`,
  };
}

export default async function RootLayout({ children, params }) {
  const { username } = await params;
  return <UserAppProvider username={username}>{children}</UserAppProvider>;
}
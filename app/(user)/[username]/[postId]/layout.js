import React from "react";
import { UserAppProvider } from "../UserContext";
import { GetDetailsPostProvider } from "@/app/context/GetPostDetails";

export const metadata = {
  title: `Post Details`,
  description: "Details of the post",
};

export default async function RootLayout({ children, params }) {
  const { username, postId } = await params;
  return (
    <UserAppProvider username={username}>
      <GetDetailsPostProvider postId={postId}>
        {children}
      </GetDetailsPostProvider>
    </UserAppProvider>
  );
}

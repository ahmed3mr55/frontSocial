import React from "react";
import { UserProvider } from "@/app/context/UserContext";

export const metadata = {
  title: "Settings",
  description: "Settings Page",
};
const layout = ({ children }) => {
  return (
    <>
      <UserProvider>
        {children}
        {(metadata.title = "Account Settings")}
      </UserProvider>
    </>
  );
};

export default layout;

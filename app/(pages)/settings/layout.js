import React from "react";
import { UserProvider } from "@/app/context/UserContext";

export const metadata = {
  title: "Settings | A Social",
  description: "Settings Page of A Social",
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

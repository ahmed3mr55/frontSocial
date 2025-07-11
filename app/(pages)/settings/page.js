"use client";
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import UpdateEmail from "./Components/UpdateEmail";
import UpdatePassword from "./Components/UpdatePassword";
import PrivateAccount from "./Components/PrivateAccount";
import { useUser } from "@/app/context/UserContext";
import FA2 from "./Components/FA2";
import Logout from "./Components/Logout";
import GenerateQECode from "./Components/GenerateQECode";

const Page = () => {
  const { user } = useUser();
  const [isOpenWindowEmail, setIsOpenWindowEmail] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isOpenWindowPassword, setIsOpenWindowPassword] = useState(false);

  const styleCard = (section) => {
    const base = "p-4 bg-white rounded-lg transition flex flex-col w-full";
    const shadow = activeSection === section ? "shadow-sm" : "";
    return `${base} ${shadow}`;
  };

  return (
    <div className="flex items-center justify-center p-4 transition-colors">
      {isOpenWindowEmail && (
        <UpdateEmail
          initialEmail={user.email}
          onClose={() => setIsOpenWindowEmail(false)}
        />
      )}
      {isOpenWindowPassword && (
        <UpdatePassword onClose={() => setIsOpenWindowPassword(false)} />
      )}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow transition-colors">
        <div className="divide-y divide-gray-200 space-y-4">
          {/* Account Section */}
          <div className={styleCard("Account")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={20} />
                <h2 className="text-lg font-semibold">Account</h2>
              </div>
              <button className="text-blue-500 hover:underline">Edit</button>
            </div>
            <div className="mt-3 space-y-2">
              <div
                onClick={() => {
                  setActiveSection("Account");
                  setIsOpenWindowEmail(true);
                }}
                className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              >
                Change Email
              </div>
              <div
                onClick={() => {
                  setActiveSection("Account");
                  setIsOpenWindowPassword(true);
                }}
                className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              >
                Change Password
              </div>
              <div
                className="p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <GenerateQECode />
              </div>
              <Logout />
            </div>
          </div>

          {/* Security Section */}
          <div
            onClick={() => setActiveSection("Security")}
            className={styleCard("Security")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={20} />
                <h2 className="text-lg font-semibold">Security</h2>
              </div>
              <button className="text-blue-500 hover:underline">Edit</button>
            </div>
            <div className="mt-3 space-y-2">
              {/* {Placeholder for security options} */}
              <PrivateAccount isPrivate={user?.isPrivate} />
            </div>
            <div className="mt-3 space-y-2">
              <FA2 twoFactorEnabled={user?.twoFactorEnabled} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

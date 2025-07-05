"use client";
import React, { useState } from "react";
import WinCreatePost from "./WinCreatePost";
import Login from "../auth/Login";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

const CreatePost = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isOpenWindow, setIsOpenWindow] = useState(false);

  const handleOpen = () => {
    setIsOpenWindow(true);
  };
  const handleClose = () => {
    setIsOpenWindow(false);
  };

  return (
    <>
      {isOpenWindow && (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          {user ? (
            <WinCreatePost onClose={handleClose} />
          ) : (
            <Login onClose={handleClose} />
          )}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg gap-5 mb-4 shadow-md flex flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center gap-1">
          <div
            onClick={() => router.push("/profile")}
            className="size-11 rounded-full bg-gray-300 overflow-hidden flex cursor-pointer"
          >
            <img
              src={user?.profilePicture?.url || "/assets/iconUser.png"}
              alt="profile image"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            onClick={handleOpen}
            className="bg-gray-100 rounded-full flex items-center py-3 w-full cursor-pointer hover:bg-gray-200"
          >
            <p className="text-md mx-4 text-gray-500">
              {user ? `What's on your mind, ${user.firstName}?` : "Login to create a post"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;

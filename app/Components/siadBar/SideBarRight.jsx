"use client";
import React from "react";
import { useState } from "react";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import FollowRequest from "../FollowRequest";
import Login from "../auth/Login";

const SideBarRight = ({ firstName, lastName, profilePicture, isPrivate }) => {
  const router = useRouter();
  const [isOpenWindow, setIsOpenWindow] = useState(false);
  return (
    <aside className="fixed top-16 right-0 bottom-0 w-1/5 bg-gray-100  p-4 hidden lg:flex flex-col items-center z-10">
      {isOpenWindow && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setIsOpenWindow(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Login onClose={() => setIsOpenWindow(false)} />
          </div>
        </div>
      )}
      <ul className="flex flex-col mt-1 items-end w-full text-center border-b-[1.5px]">
        <li className="text-black flex w-full items-center text-lg ">
          <h2 className="text-blue-600 text-center font-bold text-3xl mb-4">
            A social
          </h2>
        </li>
        {firstName && lastName && profilePicture && (
          <li
            onClick={() => router.push("/profile")}
            className="text-black flex w-full  py-1 items-center text-lg mb-2 hover:bg-gray-300 p-1 hover:rounded-md cursor-pointer"
          >
            {profilePicture && (
              <div className="size-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                <img src={profilePicture} alt="profile image" />
              </div>
            )}{" "}
            {firstName && lastName && (
              <span className="ml-2">
                {firstName} {lastName}
              </span>
            )}
          </li>
        )}
        {!firstName && !lastName && (
          <button
            className="bg-blue-500 w-full cursor-pointer text-white px-4 py-2 rounded-lg"
            onClick={() => setIsOpenWindow(true)}
          >
            Login
          </button>
        )}
        <li className="text-black flex w-full py-1 items-center text-lg mb-2  hover:bg-gray-300 hover:rounded-md p-1 cursor-pointer">
          <Users size={25} className="mr-2" />
          <span>Followers</span>
        </li>
      </ul>
      {isPrivate && <FollowRequest />}
    </aside>
  );
};

export default SideBarRight;

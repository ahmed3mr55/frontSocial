"use client";
import React from "react";
import { Home, User, Settings, LogOut } from "lucide-react";
import WinCreatePost from "../post/WinCreatePost";
import { useRouter } from "next/navigation";

const SiadBar = () => {
  const router = useRouter();
  const [isOpenWindow, setIsOpenWindow] = React.useState(false);

  return (
    <div>
      {isOpenWindow && <WinCreatePost onClose={() => setIsOpenWindow(false)} />}
      <div className="fixed top-16 left-0 bottom-0 w-1/5 bg-gray-100 p-4 md:flex hidden sm:hidden lg:flex flex-col items-center z-10">
        <h2 className="text-blue-600 font-bold text-3xl mb-4">A social</h2>
        <hr className="w-full border-gray-300" />
        <div className="flex flex-col justify-between h-full w-full">
          <ul className="flex flex-col items-start w-full">
            <li onClick={() => router.push("/")} className="text-black text-lg mb-2 w-full mt-1 hover:bg-gray-300 flex items-center gap-2 p-2 hover:rounded-md cursor-pointer">
              <Home className="w-5 h-5" />
              Home
            </li>
            <li onClick={() => router.push("/profile")} className="text-black text-lg mb-2 w-full flex items-center gap-2 p-2 hover:bg-gray-300 hover:rounded-md cursor-pointer">
              <User className="w-5 h-5" />
              Profile
            </li>
            <li onClick={() => router.push("/settings")} className="text-black text-lg mb-2 flex w-full items-center gap-2 p-2 hover:bg-gray-300 hover:rounded-md cursor-pointer">
              <Settings className="w-5 h-5" />
              Settings
            </li>
          </ul>

          <div className="w-full mt-auto pt-4">
            <button onClick={() => setIsOpenWindow(true)} className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg w-full">
              Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiadBar;

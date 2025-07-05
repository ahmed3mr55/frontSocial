"use client";
import React, { useEffect, useState } from "react";
import { useUserApp } from "../../UserContext";
import Follow from "../../../Components/Follow";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck } from "lucide-react";

const UserDetails = () => {
  const { user } = useUserApp();
  const pathname = usePathname();
  const [fullURL, setFullURL] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullURL(window.location.origin + pathname);
    }
  }, [pathname]);

  return (
    <div className="bg-white rounded-lg shadow-md p-1 w-full">
      <div className="flex items-center p-1 border-b">
        <Link
          href={`/${user?.username}`}
          className="size-11 rounded-full overflow-hidden"
        >
          <img
            className="w-fit"
            src={user?.profilePicture?.url || "/assets/iconUser.png"}
            alt="profile image"
          />
        </Link>
        <div className="ml-3 flex items-center justify-between w-full">
          <Link href={`/${user?.username}`} className="flex flex-col">
            <h3 className="font-bold flex items-center">
              {user?.firstName || ""} {user?.lastName || ""} {user?.verified && <BadgeCheck className="ml-1" color="blue" size={16} />}
            </h3>
            <p className="text-gray-500 text-sm">@{user?.username || ""}</p>
          </Link>
          <Follow username={user?.username || ""} />
        </div>
      </div>
      <div className="flex items-center justify-center p-1">
        <h3 className="bg-gray-200 px-2 py-1 rounded-lg text-gray-500 text-md cursor-pointer">
          followers {user?.followersCount || 0}
        </h3>
        <h3 className="bg-gray-200 px-2 py-1 ml-2 rounded-lg text-gray-500 text-md cursor-pointer">
          following {user?.followingCount || 0}
        </h3>
      </div>
      <div>
        <div className="flex items-center gap-2 justify-center p-1">
          <button
            className=" cursor-pointer p-1 text-gray-500 text-sm bg-gray-200 rounded-lg w-full"
            onClick={() => {
              navigator.clipboard.writeText(fullURL) && setIsCopied(true);
            }}
          >
            {isCopied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

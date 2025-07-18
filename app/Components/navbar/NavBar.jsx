"use client";
import React from "react";
import { useState } from "react";
import {
  Search,
  AlignJustify,
  House,
  User,
  Bell,
  AlignLeft,
  Settings,
  Users,
} from "lucide-react";
import Noitfications from "../noitfications/Noitfications";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

const NavBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useUser();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleToggle = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-white p-4 flex justify-between shadow-sm items-center z-50 ">
      <div>
        <h1 className="text-blue-600 hover:text-blue-800 font-bold p-1 lg:text-3xl md:text-2xl sm:text-2xl text-2xl cursor-pointer">
          A social
        </h1>
      </div>

      <ul className="flex items-center">
        <div className="relative flex items-center bg-gray-300 hover:bg-gray-200 rounded-full p-2">
          <Search
            onClick={handleToggle}
            size={20}
            color="black"
            className="cursor-pointer"
          />
          {isOpen && (
            <div className="absolute top-full right-0 bg-gray-300 rounded-md p-2 mt-2 shadow-lg">
              <input
                value={search}
                onChange={handleSearch}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim() !== "") {
                    router.push(`/search/top?q=${encodeURIComponent(search)}`);
                    setIsOpen(false);
                    setSearch("");
                  }
                }}
                type="search"
                className="bg-transparent outline-none text-black p-2 w-64 placeholder:text-gray-600"
                placeholder="Search"
              />

              <button
                onClick={handleClose}
                className="absolute top-1 right-1 text-black text-sm hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          )}
          <input
            value={search}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim() !== "") {
                router.push(`/search/top?q=${encodeURIComponent(search)}`);
                setIsOpen(false);
                setSearch("");
              }
            }}
            type="search"
            className="bg-transparent outline-none text-black ml-2 lg:block md:hidden hidden sm:hidden placeholder:text-gray-600"
            placeholder="Search"
          />
        </div>
        <li
          onClick={() => router.push("/")}
          className="inline-block mx-2 p-3 rounded-full hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
        >
          <House
            size={20}
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          />
        </li>
        {user && (
          <>
            <li
              onClick={() => router.push("/profile")}
              className="lg:inline-block sm:hidden hidden mx-1 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
            >
              <User
                size={20}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              />
            </li>
            <li className="inline-block mx-1 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200  relative">
              <Bell
                onClick={handleNotificationClick}
                size={20}
                className="text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
              />
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                  <Noitfications onClose={handleNotificationClick} />
                </div>
              )}
            </li>
          </>
        )}

        <ul>
          {isMobileMenuOpen ? (
            <li className="bg-gray-300 p-1 rounded-lg">
              <AlignLeft
                size={20}
                color="blue"
                className="cursor-pointer lg:hidden md:block sm:block block"
                onClick={handleClick}
              />
            </li>
          ) : (
            <AlignJustify
              size={20}
              color="black"
              className="cursor-pointer lg:hidden md:block sm:block block"
              onClick={handleClick}
            />
          )}
          {isMobileMenuOpen && (
            <div>
              <ul className="absolute top-full right-0 bg-gray-300 rounded-md p-2 mt-2 shadow-lg">
                <li
                  onClick={() => router.push("/profile")}
                  className="flex flex-col items-center gap-1 text-black hover:text-gray-600 cursor-pointer p-2"
                >
                  <User size={20} />
                  <p className="text-md select-none">Profile</p>
                </li>
                {user?.isPrivate && (
                  <li
                    onClick={() => router.push("/followRequests")}
                    className="flex flex-col items-center gap-1 text-black hover:text-gray-600 cursor-pointer p-2"
                  >
                    <Users size={20} />
                    <p className="text-sm select-none">Follow</p>
                    <span className="text-sm select-none">Requests</span>
                  </li>
                )}

                <li
                  onClick={() => router.push("/settings")}
                  className="flex flex-col items-center gap-1 text-black hover:text-gray-600 cursor-pointer p-2"
                >
                  <Settings size={20} />
                  <p className="text-md select-none">Settings</p>
                </li>
              </ul>
            </div>
          )}
        </ul>
      </ul>
    </nav>
  );
};

export default NavBar;

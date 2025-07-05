"use client";
import React from "react";
import ProfileHeader from "../Components/profileDetails/ProfileHeader";
import InfoProfile from "../Components/profileDetails/InfoProfile";
import PostList from "../Components/PostList";
import { useUser } from "@/app/context/UserContext";
import CreatePost from "@/app/Components/post/CreatePost";
import Spinner from "@/app/Components/Spinner";

const Page = () => {
  const { user, links } = useUser();
  console.log(links);
  if (!user) {
    return <div className="text-center flex items-center flex-col justify-center mt-20"><Spinner />Loding...</div>
  }
  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <ProfileHeader
        isprofile
        followers={user.followersCount}
        following={user.followingCount}
        avatarUrl={user.profilePicture.url}
        firstName={user.firstName}
        lastName={user.lastName}
        isVrified={user.verified}
        username={user.username}
        bio={user.bio}
      />

      {/* Wrapper */}
      <div className="max-w-6xl w-full mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block md:sticky md:top-20 md:w-2/5 lg:w-1/3 self-start">
            <InfoProfile
              bio={user.bio}
              isProfile
              country={user.country}
              city={user.city}
              relationship={user.relationship}
              links={links}
            />
          </aside>

          {/* Posts */}
          <main className="w-full overflow-hidden md:w-3/5 lg:w-3/4 flex flex-col gap-1">
            <CreatePost />
            <PostList username={user.username} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;

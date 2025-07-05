"use client";
import React from 'react'
import ProfileHeader from './profileDetails/ProfileHeader';
import InfoProfile from './profileDetails/InfoProfile';
import PostList from './PostList';
import Alert from '@/app/Components/Alert';
import Spinner from '@/app/Components/Spinner';
import NotFound from '@/app/Components/NotFound';
import { useUserApp } from '../[username]/UserContext';

const RenderProfile = ({username}) => {
  const { user, loading, error, links, errorLinks, loadingLinks } = useUserApp();

  if (loading) return <div className="text-center flex items-center flex-col justify-center mt-20"><Spinner /></div>;
  if (!user && !error) {
    return <NotFound />
  }
  if (error) return <div className="text-center flex items-center flex-col justify-center mt-20"><Alert type="error" message={error} /></div>;

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <ProfileHeader
        isprofile={false}
        username={username}
        firstName={user.firstName}
        lastName={user.lastName}
        avatarUrl={user.profilePicture?.url || "/assets/iconUser.jpg"}
        followers={user.followersCount}
        following={user.followingCount}
        isVrified={user.verified}
      />

      {/* Wrapper*/}
      <div className="max-w-6xl w-full mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <aside className="block w-full md:sticky md:top-20 self-start md:w-2/5 lg:w-1/3">
            <InfoProfile
              bio={user.bio}
              country={user.country}
              city={user.city}
              links={links}
              relationship={user.relationship}
              isProfile={false}
            />
          </aside>
          
          {/* Posts */}
          <main className="w-full overflow-hidden md:w-3/5 lg:w-3/4 flex flex-col gap-6">
            <PostList username={username} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default RenderProfile

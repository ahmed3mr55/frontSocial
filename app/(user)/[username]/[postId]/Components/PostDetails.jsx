"use client"
import React from 'react'
import { useGetDetailsPost } from '@/app/context/GetPostDetails';
import { formatPostDate }  from '@/app/utils/formatDate';
import { BadgeCheck } from "lucide-react";
import Alert from '@/app/Components/Alert';
import Spinner from '@/app/Components/Spinner';
import Link from 'next/link';

const PostDetails = () => {
    const { post, errorPost, loadingPost } = useGetDetailsPost();
    if (loadingPost) return <Spinner/>
  return (
    <div className='flex flex-col gap-2 min-h-[200px]  p-3 mt-4 rounded-lg bg-white shadow-md'>
      {errorPost && <Alert type={error} message={errorPost} />}
      <div className='flex items-center gap-2'>
        <Link href={`/${post?.user.username}`} className='lg:size-12 md:size-12 sm:size-10 size-10 rounded-full overflow-hidden'>
          <img src={post?.user.profilePicture?.url || "/assets/iconUser.png"} alt="profile image" />
        </Link>
        <Link href={`/${post?.user.username}`} className='flex flex-col'>
          <h2 className='text-md flex items-center font-semibold'>{post?.user.firstName} {post?.user.lastName} {post?.user.verified && <BadgeCheck className="ml-1" color="blue" size={16} />}</h2>
          <p className='text-sm text-gray-600'>{formatPostDate(post?.createdAt)}</p>
        </Link>
      </div>

      <div className='mt-2'>
        <p dir='auto' className='lg:text-lg md:text-lg sm:text-md text-md'>{post?.body}</p>
      </div>
    </div>
  )
}

export default PostDetails

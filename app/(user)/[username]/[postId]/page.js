"use client"
import React from 'react'
import UserDetails from './Components/UserDetails'
import Details from './Components/Details'
import CreateComment from './Components/CreateComment'
import Actions from './Components/Actions'
import PostDetails from './Components/PostDetails'
import { useUserApp } from '../UserContext'
import { useGetDetailsPost } from '@/app/context/GetPostDetails'
import NotFound from '@/app/Components/NotFound'
import Spinner from '@/app/Components/Spinner'
import { useParams } from 'next/navigation'

const Page = () => {
  const { postId, username } = useParams();
  if (!postId) {
    return <NotFound />
  }
  const { loading, error } = useUserApp();
  const { errorPost } = useGetDetailsPost();
  if (errorPost || error) {
    return (
      <div>
        <NotFound />
      </div>
    )
  }
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='mt-1 p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative'>
      
      <div className='col-span-1 p-3 order-2 md:order-1'>
        <UserDetails />
        <Actions postId={postId} />
        <Details />
        <CreateComment postId={postId} />
      </div>

      <div className='lg:col-span-2 md:col-span-1 pb-6 order-1 md:order-2'>
        <PostDetails username={username} />
      </div>

    </div>
  )
}

export default Page

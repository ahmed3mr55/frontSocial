import React from 'react'
import FollowRequest from '@/app/Components/FollowRequest'

const page = () => {
  return (
    <div className='flex justify-center min-h-screen'>
      <div className='flex items-center flex-col mt-5 lg:w-1/2 md:w-1/2 w-full'>
      <h2 className='text-2xl font-bold'>Follow Requests</h2>
      <FollowRequest />
      </div>
    </div>
  )
}

export default page

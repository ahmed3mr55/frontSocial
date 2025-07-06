import React from 'react'
import FollowRequest from '@/app/Components/FollowRequest'

const page = () => {
  return (
    <div className='flex items-center flex-col mt-5 h-screen'>
      <h2 className='text-2xl font-bold'>Follow Requests</h2>
      <FollowRequest />
    </div>
  )
}

export default page

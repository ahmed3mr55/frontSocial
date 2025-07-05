import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 p-4 h-[90vh] shadow-md rounded-lg'>
      <div className='flex w-full items-center justify-center'>
        <img src="/assets/404.png" alt="404" />
      </div>
        <div className='flex flex-col items-center justify-center'>
            <h2 className='lg:text-3xl md:text-3xl sm:text-2xl text-xl font-bold'>Oops, the page not found 404</h2>
            <p className='text-gray-600 lg:text-lg md:text-lg sm:text-md text-md'>The page you are looking for does not exist.</p>
        </div>
    </div>
  )
}

export default NotFound

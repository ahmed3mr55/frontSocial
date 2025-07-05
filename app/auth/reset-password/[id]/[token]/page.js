import React from 'react'
import ResetPassword from '@/app/Components/auth/ResetPassword'

const page = async ({ params }) => {
    const { id, token } = await params
  return (
    <div>
      <ResetPassword id={id} token={token} />
    </div>
  )
}

export default page

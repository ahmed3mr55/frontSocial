"use client"
import React from 'react';
import { CircleAlert, Check  } from 'lucide-react';

const Alert = ({type, message}) => {
    const setColors = () => {
        if (type === "error") return "text-red-900 bg-red-100 border-red-500"
        return "text-green-900 bg-green-100 border-green-500"
    }
  return (
    <div className={`rounded-md text-sm p-2 flex items-center my-1 border ${setColors()}`}>
      {type === "error" ? <CircleAlert className='me-1' /> : <Check className='me-1' />} 
      {message}
    </div>
  )
}

export default Alert

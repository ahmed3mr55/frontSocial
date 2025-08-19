"use client";
import React from "react";
import { X } from "lucide-react";

const ViewImage = ({ onClose, imageUrl}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">View Image</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full cursor-pointer hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 border-b">
            <div className="w-full max-h-1/2 overflow-hidden rounded-lg">
                <img className="w-full h-full object-cover" src={imageUrl || ""} alt="image" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImage;

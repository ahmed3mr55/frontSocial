import React from "react";
import SignUp from "@/app/Components/auth/Signup";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="lg:text-lg md:text-md sm:text-md text-sm font-bold mb-6 p-2">
        Welcome to join us! Please sign up.
      </h2>
      <div>
        <SignUp />
      </div>
    </div>
  );
};

export default page;

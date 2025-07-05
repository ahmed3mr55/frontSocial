import React from "react";
import Login from "@/app/Components/auth/Login";

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="lg:text-lg md:text-md sm:text-md text-sm font-bold mb-6 p-2">Welcome Back! Please log in.</h2>
            <div>
                <Login />
            </div>
        </div>
    );
};

export default page;

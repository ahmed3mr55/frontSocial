"use client";
import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import Alert from "../Alert";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ firstName, lastName, email, password }),
                }
            );
            const data = await res.json();
            if (res.ok) {
                setSuccess(data.message || "Account created successfully");
                Cookies.set("userId", data.userId, { expires: 30 });
            } else {
                setError(data.message || "Failed to create account");
            }
        } catch (err) {
            setError("An error occurred. Please try again later");
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        location.href = "/";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="lg:p-12 md:p-8 sm:p-6 p-4 lg:gap-8 md:gap-6 sm:gap-4 gap-8 bg-gray-100 rounded shadow-md"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label
                            htmlFor="firstName"
                            className="text-sm font-medium text-gray-700"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor="lastName"
                            className="text-sm font-medium text-gray-700"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:gap-4 md:gap-3 gap-2 mb-4">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@ex.com"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col lg:gap-4 md:gap-3 gap-2 mb-4">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex items-center mt-1">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword((prev) => !prev)}
                            className="mr-2"
                        />
                        <label htmlFor="showPassword" className="text-sm">
                            Show password
                        </label>
                    </div>
                </div>

                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <button
                    type="submit"
                    disabled={loading}
                    className="disabled:opacity-50 w-full lg:text-md md:text-md sm:text-md text-sm bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer"
                >
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <UserPlus size={20} className="inline-block me-1" />
                            Sign Up
                        </>
                    )}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default SignUp;

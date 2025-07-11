"use client";
import React from "react";
import { useState, useEffect } from "react";
import { LogIn, X } from "lucide-react";
import Alert from "../Alert";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import QRCodeScanner from "./QRCodeScanner";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await res.json();
      if (data.twoFactorRequired) {
        setTwoFactorRequired(true);
        setTempToken(data.tempToken);
        Cookies.set("tempToken", data.tempToken, { expires: 1 });
        setSuccess(
          "Two-factor authentication required. Please check your email."
        );
        router.push("/auth/verification");
        return;
      }
      if (res.ok) {
        setSuccess("Login successful!");
        Cookies.set('userId', data.userId, { expires: 30 });
        location.href = "/";
        return;
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);


  return (
    <div>
      {onClose && (
        <div className="w-full bg-gray-100 flex items-center justify-end">
          <button className="p-1 rounded-full hover:bg-gray-200">
            <X onClick={onClose} className="w-6 h-6" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="lg:p-12 md:p-8 sm:p-6 p-4 lg:gap-8 md:gap-6 sm:gap-4 gap-8 bg-gray-100 rounded-b-lg shadow-md"
      >
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
            <input type="checkbox" 
              checked={showPassword}
              id="checkbox"
              onChange={() => setShowPassword((prev) => !prev)}
              className="mr-2"
            />
            <label className="text-sm" htmlFor="checkbox">Show password</label>
          </div>
        </div>
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}
        <button
          type="submit"
          disabled={loading}
          className="disabled:opacity-50 w-full bg-blue-500 lg:text-md md:text-md sm:text-md text-white py-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer"
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <LogIn size={20} className="inline-block me-1" />
              Login
            </>
          )}
        </button>
        <div className="flex flex-col items-center justify-center">
          <p className="mt-4 text-center lg:text-sm md:text-sm sm:text-xs text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
          <div>
            <QRCodeScanner/>
          </div>
        </div>
        <p className="mt-4 text-center lg:text-sm md:text-sm sm:text-xs text-sm text-gray-600">
          <a href="/auth/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

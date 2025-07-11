"use client";
import React from "react";
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";

const GenerateQECode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlerGetQrCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/generate/qrcode`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to fetch user data");
      }
      setQrCode(data.qrcodeToken);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) handlerGetQrCode();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm p-4 bg-white rounded-lg">
            <div className="flex items-center flex-col justify-center">
              <h3 className="lg:text-lg md:text-md sm:text-md text-md font-semibold mb-4">
                Login with QR Code
              </h3>
              {loading ? <Spinner /> : <QRCode value={qrCode} size={200} />}
              {error && <Alert type="error" message={error} />}
            </div>
            <button
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
        Login with QR Code
      </button>
    </>
  );
};

export default GenerateQECode;
